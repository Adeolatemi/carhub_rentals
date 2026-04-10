import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      setLoading(false);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) localStorage.setItem("token", response.data.token);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      return response.data.user;
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

