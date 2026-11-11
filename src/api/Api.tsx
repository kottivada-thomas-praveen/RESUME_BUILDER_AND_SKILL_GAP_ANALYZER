import axios from "axios";
import { getToken, getRefreshToken, setToken, removeToken } from "../utils/token";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Add token automatically — reads both key variants for backward compatibility.
Api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: automatically refresh expired token on 401 before logging out
let isRefreshingApi = false;
let apiFailedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processApiQueue = (error: unknown, token: string | null = null) => {
  apiFailedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  apiFailedQueue = [];
};

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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

      if (isRefreshingApi) {
        return new Promise((resolve, reject) => {
          apiFailedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return Api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshingApi = true;

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

          processApiQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return Api(originalRequest);
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (refreshErr) {
        processApiQueue(refreshErr, null);
        removeToken();
        sessionStorage.removeItem("auth_user_cache");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshingApi = false;
      }
    }

    return Promise.reject(error);
  }
);

export default Api;
