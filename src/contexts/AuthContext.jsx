import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user using stored token
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Fetch user error:", error.response?.data || error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED login function - properly handles token from response
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Login API response:", response.data);
      
      // ✅ CORRECT: token is in response.data.token (axios puts data in response.data)
      const token = response.data?.token;
      const userData = response.data?.user;
      
      if (!token) {
        console.error("No token in response:", response.data);
        throw new Error("No token received from server");
      }
      
      // Save token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || "Invalid email or password";
      throw new Error(errorMessage);
    }
  };

  // Register function (if you want to include it here)
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      console.log("Register response:", response.data);
      
      const token = response.data?.token;
      const newUser = response.data?.user;
      
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      }
      
      return newUser;
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || "Registration failed";
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // Load user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    fetchUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};