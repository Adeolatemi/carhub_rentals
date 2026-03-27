import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { setUser(null); return; }
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/auth/login", {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      const data = await response.json();
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        await fetchUser();
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch("/auth/logout", {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchUser().finally(() => setLoading(false));
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
