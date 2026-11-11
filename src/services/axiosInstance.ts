import axios from "axios";
import { getToken, getRefreshToken, setToken, removeToken } from "../utils/token";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Axios Request Interceptor: Automatically attach Authorization Bearer header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Concurrency lock for refresh token request to avoid duplicate refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Axios Response Interceptor: Handle 401 Unauthorized with automatic transparent token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, if not already retried, and not during auth endpoints
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/login") &&
      !originalRequest.url?.includes("/api/auth/refresh")
    ) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        removeToken();
        sessionStorage.removeItem("auth_user_cache");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue concurrent requests while token is refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken,
          token: refreshToken,
        });

        const authData = refreshResponse.data?.data;
        if (authData?.token) {
          const newToken = authData.token;
          const newRefreshToken = authData.refreshToken || refreshToken;
          setToken(newToken, newRefreshToken);

          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        removeToken();
        sessionStorage.removeItem("auth_user_cache");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
