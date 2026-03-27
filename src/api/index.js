// src/api/index.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  }
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  return config;
});

// Auth endpoints
export const auth = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
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

// Export default axios instance if you need raw access
export default api;