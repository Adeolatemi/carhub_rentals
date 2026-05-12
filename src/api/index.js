// src/api/index.js
import api from './client';

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

// ✅ Add this for Profile.jsx compatibility
export const request = api;
export default api;