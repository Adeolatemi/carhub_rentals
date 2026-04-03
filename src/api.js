// src/api.js
import axios from "axios";

// --- Proxy-friendly base URL ---
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Vite proxy forwards to backend

// --- Axios instance ---
const request = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // include cookies/session auth
});

// --- Automatically attach token if available ---
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- API functions ---

// Login user
async function login(email, password) {
  const res = await request.post("/auth/login", { email, password });
  return res.data;
}

// Logout user
async function logout() {
  const res = await request.post("/auth/logout");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return res.data;
}

// Get current logged-in user
async function getUser() {
  const res = await request.get("/auth/me");
  return res.data;
}

// Update user profile
async function updateProfile(profileData) {
  const res = await request.put("/users/me", profileData);
  return res.data;
}

// Generic GET request
async function get(path) {
  const res = await request.get(path);
  return res.data;
}

// Generic POST request with JSON body
async function post(path, body) {
  const res = await request.post(path, body);
  return res.data;
}

// Upload file (multipart/form-data)
async function postForm(path, formData) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_BASE + path, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

// --- Named exports ---
export {
  request,
  login,
  logout,
  getUser,
  updateProfile,
  get,
  post,
  postForm,
};

export default {
  request,
  login,
  logout,
  getUser,
  updateProfile,
  get,
  post,
  postForm,
};