import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8080/api/auth/login",
});

// Automatically inject Authorization Bearer token if it exists in localStorage
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;