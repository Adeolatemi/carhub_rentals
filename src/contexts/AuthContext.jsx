import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user using stored token
  const fetchUser = async () => {
    console.log("🔍 [fetchUser] Starting...");
    const token = localStorage.getItem("token");
    console.log("🔍 [fetchUser] Token in localStorage:", token ? `Yes (length: ${token.length})` : "No");
    
    if (!token) {
      console.log("🔍 [fetchUser] No token found, setting user to null");
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      console.log("🔍 [fetchUser] Making API call to /auth/me");
      const response = await api.get("/auth/me");
      console.log("🔍 [fetchUser] Response received:", response.data);
      
      if (response.data?.user) {
        console.log("🔍 [fetchUser] User found:", response.data.user.email);
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        console.log("🔍 [fetchUser] No user in response, clearing localStorage");
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("🔍 [fetchUser] Error:", error.response?.data || error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
      console.log("🔍 [fetchUser] Completed, loading set to false");
    }
  };

  // ✅ LOGIN FUNCTION WITH DEBUG LOGS
  const login = async (email, password) => {
    console.log("══════════════════════════════════════════");
    console.log("🔐 [login] FUNCTION CALLED");
    console.log("══════════════════════════════════════════");
    console.log("📧 [login] Email provided:", email);
    console.log("🔑 [login] Password length:", password?.length || 0);
    console.log("🌐 [login] API Base URL:", api.defaults?.baseURL);
    console.log("📋 [login] API headers:", api.defaults?.headers);
    console.log("══════════════════════════════════════════");
    
    try {
      console.log("📡 [login] Making POST request to /auth/login...");
      const response = await api.post("/auth/login", { email, password });
      
      console.log("✅ [login] API RESPONSE RECEIVED");
      console.log("📊 [login] Response status:", response.status);
      console.log("📊 [login] Response statusText:", response.statusText);
      console.log("📊 [login] Response headers:", response.headers);
      console.log("📊 [login] Response data type:", typeof response.data);
      console.log("📊 [login] Full response.data:", JSON.stringify(response.data, null, 2));
      
      // Extract token and user data
      const token = response.data?.token;
      const userData = response.data?.user;
      
      console.log("🔑 [login] Token extracted:", token ? `Yes (length: ${token.length}, preview: ${token.substring(0, 30)}...)` : "NO");
      console.log("👤 [login] User data extracted:", userData ? `Yes (email: ${userData.email})` : "NO");
      
      if (!token) {
        console.error("❌ [login] CRITICAL: No token found in response!");
        console.error("❌ [login] Response.data keys:", Object.keys(response.data || {}));
        throw new Error("No token received from server");
      }
      
      // Save token and user data
      console.log("💾 [login] Saving token to localStorage...");
      localStorage.setItem("token", token);
      
      console.log("💾 [login] Saving user to localStorage...");
      localStorage.setItem("user", JSON.stringify(userData));
      
      console.log("💾 [login] Updating state with user...");
      setUser(userData);
      
      // Verify localStorage was updated
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      console.log("✅ [login] Token saved successfully:", savedToken ? "Yes" : "No");
      console.log("✅ [login] User saved successfully:", savedUser ? "Yes" : "No");
      
      console.log("🎉 [login] LOGIN COMPLETED SUCCESSFULLY!");
      console.log("══════════════════════════════════════════");
      
      return userData;
      
    } catch (error) {
      console.error("══════════════════════════════════════════");
      console.error("❌ [login] LOGIN FAILED");
      console.error("══════════════════════════════════════════");
      console.error("📛 [login] Error type:", error.constructor.name);
      console.error("📛 [login] Error message:", error.message);
      console.error("📛 [login] Full error object:", error);
      
      if (error.response) {
        console.error("📛 [login] Error response status:", error.response.status);
        console.error("📛 [login] Error response data:", error.response.data);
        console.error("📛 [login] Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("📛 [login] No response received. Request made but no response.");
        console.error("📛 [login] Request:", error.request);
      } else {
        console.error("📛 [login] Error setting up request:", error.message);
      }
      
      console.error("══════════════════════════════════════════");
      
      const errorMessage = error.response?.data?.error || "Invalid email or password";
      console.error(`📛 [login] Throwing error message: "${errorMessage}"`);
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    console.log("📝 [register] Starting registration for:", userData.email);
    
    try {
      const response = await api.post("/auth/register", userData);
      console.log("✅ [register] Response:", response.data);
      
      const token = response.data?.token;
      const newUser = response.data?.user;
      
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        console.log("✅ [register] User registered and logged in");
      }
      
      return newUser;
    } catch (error) {
      console.error("❌ [register] Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || "Registration failed";
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    console.log("🚪 [logout] Logging out...");
    try {
      await api.post("/auth/logout");
      console.log("✅ [logout] Server logout successful");
    } catch (err) {
      console.error("❌ [logout] Error:", err.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.log("✅ [logout] localStorage cleared, user set to null");
    }
  };

  // Load user on mount
  useEffect(() => {
    console.log("🔄 [useEffect] AuthProvider mounted, fetching user...");
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

  console.log("🏭 [AuthProvider] Current state - loading:", loading, "user:", user?.email || "null");

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