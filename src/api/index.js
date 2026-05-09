// src/api/index.js - NO axios instance export
import axios from "axios";

const API_URL = 'https://carhub-api.fly.dev';

console.log("🔧 API URL:", API_URL);

// Create axios instance internally (not exported)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ONLY export the functions, NOT the api instance
export const auth = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const vehicles = {
  list: (params = {}) => api.get("/vehicles", { params }),
  get: (id) => api.get(`/vehicles/${id}`),
};

export const subscriptions = {
  me: () => api.get("/subscriptions/me"),
  subscribe: (plan) => api.post("/subscriptions/subscribe", { plan }),
};

// DO NOT export api as default - this is what's causing the crash
// No export default
// No export { api }