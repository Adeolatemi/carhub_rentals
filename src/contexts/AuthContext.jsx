import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { 
        setUser(null); 
        setLoading(false);
        return; 
      }
      const response = await fetch(API_URL + "/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include'
      });
      if (!response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(API_URL + "/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    login,
    logout,
    fetchUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

