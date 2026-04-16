import React, { useState, useEffect } from "react";
import api from "../../api";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", dailyRate: "", imageUrl: "" });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/vehicles", { ...formData, dailyRate: parseFloat(formData.dailyRate) });
      setShowAddModal(false);
      setFormData({ title: "", description: "", dailyRate: "", imageUrl: "" });
      fetchVehicles();
      alert("Vehicle added successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Error adding vehicle");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Delete this vehicle?")) {
      try {
        await api.delete(`/admin/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        alert(error.response?.data?.error || "Error deleting vehicle");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg">+ Add Vehicle</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow p-4">
            {vehicle.imageUrl && <img src={vehicle.imageUrl} alt={vehicle.title} className="w-full h-40 object-cover rounded-lg mb-3" />}
            <h3 className="font-bold text-lg">{vehicle.title}</h3>
            <p className="text-gray-600">₦{vehicle.dailyRate}/day</p>
            <p className="text-gray-500 text-sm mt-2">{vehicle.description?.substring(0, 100)}</p>
            <button onClick={() => handleDeleteVehicle(vehicle.id)} className="mt-3 text-red-600 text-sm">Delete</button>
          </div>
        ))}
      </div>

      {showAddModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
          <form onSubmit={handleAddVehicle}>
            <input type="text" placeholder="Title" className="w-full border rounded-lg p-2 mb-3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <textarea placeholder="Description" className="w-full border rounded-lg p-2 mb-3" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <input type="number" placeholder="Daily Rate (₦)" className="w-full border rounded-lg p-2 mb-3" value={formData.dailyRate} onChange={e => setFormData({...formData, dailyRate: e.target.value})} required />
            <input type="url" placeholder="Image URL" className="w-full border rounded-lg p-2 mb-4" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            <div className="flex gap-3">
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg flex-1">Add</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-300 px-4 py-2 rounded-lg flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  );
}