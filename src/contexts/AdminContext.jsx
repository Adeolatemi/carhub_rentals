import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admins, setAdmins] = useState([]);
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalVehicles: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new admin (Super Admin only)
  const addAdmin = async (adminData) => {
    try {
      const response = await api.post("/admin/admins", adminData);
      setAdmins([...admins, response.data]);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // Create partner (Admin only)
  const createPartner = async (partnerData) => {
    try {
      const response = await api.post("/admin/partners", partnerData);
      setPartners([...partners, response.data]);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // Update user role/access
  const updateUserAccess = async (userId, updates) => {
    try {
      const response = await api.patch(`/admin/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // Reset user password
  const resetPassword = async (userId, newPassword) => {
    try {
      const response = await api.post(`/admin/users/${userId}/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  return (
    <AdminContext.Provider value={{
      admins,
      partners,
      stats,
      loading,
      fetchStats,
      addAdmin,
      createPartner,
      updateUserAccess,
      resetPassword,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};