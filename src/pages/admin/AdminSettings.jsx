import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";

export default function AdminSettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        currentPassword,
        newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to change password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Change Password</h2>
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Admin Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-800 font-medium">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-800 font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Role</label>
              <p className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}