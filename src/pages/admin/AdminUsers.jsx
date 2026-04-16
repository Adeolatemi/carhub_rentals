import React, { useState, useEffect } from "react";
import api from "../../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "ADMIN" });
  const [partnerData, setPartnerData] = useState({ name: "", email: "", password: "", phone: "", company: "" });

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
      await api.post("/admin/admins", formData);
      setShowAddAdminModal(false);
      setFormData({ name: "", email: "", password: "", role: "ADMIN" });
      fetchUsers();
      alert("Admin added successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Error adding admin");
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/partners", partnerData);
      setShowAddPartnerModal(false);
      setPartnerData({ name: "", email: "", password: "", phone: "", company: "" });
      fetchUsers();
      alert("Partner created successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Error creating partner");
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
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users & Access Control</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowAddAdminModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg">+ Add Admin</button>
          <button onClick={() => setShowAddPartnerModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Create Partner</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Status</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>{user.role}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${user.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{user.isActive ? "Active" : "Inactive"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
          <form onSubmit={handleAddAdmin}>
            <input type="text" placeholder="Name" className="w-full border rounded-lg p-2 mb-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" className="w-full border rounded-lg p-2 mb-3" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full border rounded-lg p-2 mb-4" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <div className="flex gap-3">
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg flex-1">Create</button>
              <button type="button" onClick={() => setShowAddAdminModal(false)} className="bg-gray-300 px-4 py-2 rounded-lg flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>}

      {/* Add Partner Modal */}
      {showAddPartnerModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Create Partner</h2>
          <form onSubmit={handleAddPartner}>
            <input type="text" placeholder="Company Name" className="w-full border rounded-lg p-2 mb-3" value={partnerData.company} onChange={e => setPartnerData({...partnerData, company: e.target.value})} required />
            <input type="text" placeholder="Contact Person" className="w-full border rounded-lg p-2 mb-3" value={partnerData.name} onChange={e => setPartnerData({...partnerData, name: e.target.value})} required />
            <input type="email" placeholder="Email" className="w-full border rounded-lg p-2 mb-3" value={partnerData.email} onChange={e => setPartnerData({...partnerData, email: e.target.value})} required />
            <input type="tel" placeholder="Phone" className="w-full border rounded-lg p-2 mb-3" value={partnerData.phone} onChange={e => setPartnerData({...partnerData, phone: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full border rounded-lg p-2 mb-4" value={partnerData.password} onChange={e => setPartnerData({...partnerData, password: e.target.value})} required />
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1">Create</button>
              <button type="button" onClick={() => setShowAddPartnerModal(false)} className="bg-gray-300 px-4 py-2 rounded-lg flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  );
}