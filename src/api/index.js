// src/api/index.js
import axios from "axios";

// ✅ Make sure this is the correct URL
// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://carhub-api.fly.dev';
// console.log("🔧 API initialized with URL:", API_URL);

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   timeout: 30000, // 30 second timeout
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json",
//   }
// });
const API_URL = 'https://carhub-api.fly.dev';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});
// Request interceptor - add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("📤 Request interceptor - URL:", config.url);
    console.log("📤 Request interceptor - Token exists:", !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📤 Added Authorization header");
    }
    return config;
  },
  (error) => {
    console.error("📤 Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle responses properly
api.interceptors.response.use(
  (response) => {
    console.log("📥 Response interceptor - Status:", response.status);
    console.log("📥 Response interceptor - Data:", response.data);
    return response;
  },
  (error) => {
    console.error("📥 Response interceptor error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// Vehicle endpoints
export const vehicles = {
  list: (params = {}) => api.get("/vehicles", { params }),
  get: (id) => api.get(`/vehicles/${id}`),
};

// Subscription endpoints
export const subscriptions = {
  me: () => api.get("/subscriptions/me"),
  subscribe: (plan) => api.post("/subscriptions/subscribe", { plan }),
};

export default api;