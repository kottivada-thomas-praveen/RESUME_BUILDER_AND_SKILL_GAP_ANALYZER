import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.https://resume-builder-and-skill-gap-analyzer-dtqz.onrender.com/api/auth/signup,
});

// Add token automatically
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