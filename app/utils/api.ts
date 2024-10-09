import { API_BASE_URL } from "@/config/api";
import axios from "axios";

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true, // This is important for sending cookies with requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
