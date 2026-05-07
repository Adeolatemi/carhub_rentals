// src/api.js
import axios from "axios";
const API_BASE = 'https://carhub-api.fly.dev';


// Add debug log to see what URL is being used
console.log('🔍 API_BASE URL being used:', API_BASE);
console.log('🔍 VITE_API_BASE_URL from env:', import.meta.env.VITE_API_BASE_URL);

// --- Axios instance ---
const request = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// --- Request interceptor with debugging ---
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log the full URL being requested
  console.log('📡 Making request to:', config.baseURL + config.url);
  return config;
});

// --- Response interceptor to catch errors ---
request.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// --- Rest of your code remains the same ---

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