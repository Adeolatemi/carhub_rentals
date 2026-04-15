import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAdmin } from "../../contexts/AdminContext";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { addAdmin, createPartner, updateUserAccess, resetPassword } = useAdmin();
  const [users, setUsers] = useState([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [partnerData, setPartnerData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await addAdmin(formData);
      setShowAddAdminModal(false);
      setFormData({ name: "", email: "", password: "", role: "ADMIN" });
      fetchUsers();
      alert("Admin added successfully");
    } catch (error) {
      alert(error.message || "Error adding admin");
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      await createPartner(partnerData);
      setShowAddPartnerModal(false);
      setPartnerData({ name: "", email: "", password: "", phone: "", company: "" });
      fetchUsers();
      alert("Partner created successfully");
    } catch (error) {
      alert(error.message || "Error creating partner");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Change user role to ${newRole}?`)) {
      try {
        await updateUserAccess(userId, { role: newRole });
        fetchUsers();
        alert("Role updated successfully");
      } catch (error) {
        alert(error.message || "Error updating role");
      }
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      await resetPassword(selectedUser.id, newPassword);
      setShowResetPasswordModal(false);
      setNewPassword("");
      setSelectedUser(null);
      alert("Password reset successfully");
    } catch (error) {
      alert(error.message || "Error resetting password");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "SUPERADMIN": return "bg-purple-100 text-purple-600";
      case "ADMIN": return "bg-blue-100 text-blue-600";
      case "PARTNER": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users & Access Control</h1>
          <p className="text-gray-500 text-sm">Manage admins, partners, and user permissions</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {currentUser?.role === "SUPERADMIN" && (
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition text-sm sm:text-base"
            >
              + Add Admin
            </button>
          )}
          <button
            onClick={() => setShowAddPartnerModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
          >
            + Create Partner
          </button>
        </div>
      </div>

      {/* Users Table - Mobile Responsive */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-gray-600">{user.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {currentUser?.role === "SUPERADMIN" && user.role !== "SUPERADMIN" && (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="PARTNER">Partner</option>
                          <option value="CUSTOMER">Customer</option>
                        </select>
                      )}
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowResetPasswordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Reset Pwd
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border rounded-lg p-2" required />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg flex-1">Create Admin</button>
                <button type="button" onClick={() => setShowAddAdminModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create Partner Account</h2>
            <form onSubmit={handleAddPartner} className="space-y-3">
              <input type="text" placeholder="Company Name" value={partnerData.company} onChange={(e) => setPartnerData({...partnerData, company: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="text" placeholder="Contact Person" value={partnerData.name} onChange={(e) => setPartnerData({...partnerData, name: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="email" placeholder="Email" value={partnerData.email} onChange={(e) => setPartnerData({...partnerData, email: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="tel" placeholder="Phone" value={partnerData.phone} onChange={(e) => setPartnerData({...partnerData, phone: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="password" placeholder="Password (min 6 chars)" value={partnerData.password} onChange={(e) => setPartnerData({...partnerData, password: e.target.value})} className="w-full border rounded-lg p-2" required />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1">Create Partner</button>
                <button type="button" onClick={() => setShowAddPartnerModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Reset Password for {selectedUser.name}</h2>
            <input type="password" placeholder="New Password (min 6 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-lg p-2 mb-4" />
            <div className="flex gap-3">
              <button onClick={handleResetPassword} className="bg-primary text-white px-4 py-2 rounded-lg flex-1">Reset Password</button>
              <button onClick={() => { setShowResetPasswordModal(false); setNewPassword(""); setSelectedUser(null); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}