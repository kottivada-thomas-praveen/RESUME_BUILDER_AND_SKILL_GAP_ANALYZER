import axiosInstance from "../services/axiosInstance";

// Centralized API client: re-export the single unified axios instance to eliminate duplicate refresh locks and race conditions
export { axiosInstance };
export default axiosInstance;
