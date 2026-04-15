import React, { useState, useEffect } from "react";
import api from "../../api";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    seats: "",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    categoryId: "",
    features: [],
    imageUrl: "",
    description: "",
  });
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    fetchVehicles();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/vehicle-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (feature) => {
    setFormData({ ...formData, features: formData.features.filter(f => f !== feature) });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/vehicles", formData);
      setShowAddModal(false);
      setFormData({
        name: "", make: "", model: "", year: "", pricePerDay: "", seats: "",
        transmission: "AUTOMATIC", fuelType: "PETROL", categoryId: "", features: [],
        imageUrl: "", description: "",
      });
      fetchVehicles();
      alert("Vehicle added successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Error adding vehicle");
    }
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/vehicles/${selectedVehicle.id}`, formData);
      setShowEditModal(false);
      setSelectedVehicle(null);
      fetchVehicles();
      alert("Vehicle updated successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Error updating vehicle");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/admin/vehicles/${id}`);
        fetchVehicles();
        alert("Vehicle deleted successfully");
      } catch (error) {
        alert(error.response?.data?.error || "Error deleting vehicle");
      }
    }
  };

  const toggleVehicleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/vehicles/${id}/toggle-status`);
      fetchVehicles();
      alert(`Vehicle ${currentStatus ? "delisted" : "listed"} successfully`);
    } catch (error) {
      alert(error.response?.data?.error || "Error updating vehicle status");
    }
  };

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
      pricePerDay: vehicle.pricePerDay,
      seats: vehicle.seats || "",
      transmission: vehicle.transmission || "AUTOMATIC",
      fuelType: vehicle.fuelType || "PETROL",
      categoryId: vehicle.categoryId || "",
      features: vehicle.features || [],
      imageUrl: vehicle.imageUrl || "",
      description: vehicle.description || "",
    });
    setShowEditModal(true);
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
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
          <p className="text-gray-500 text-sm">Add, edit, or remove vehicles from the fleet</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition text-sm sm:text-base"
        >
          + Add New Vehicle
        </button>
      </div>

      {/* Vehicles Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-40 sm:h-48 bg-gray-200">
              {vehicle.imageUrl ? (
                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                  🚗
                </div>
              )}
              <button
                onClick={() => toggleVehicleStatus(vehicle.id, vehicle.isActive)}
                className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                  vehicle.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {vehicle.isActive ? "Active" : "Delisted"}
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{vehicle.name}</h3>
              <p className="text-gray-500 text-sm">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
              <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
                <span className="text-primary font-bold">₦{vehicle.pricePerDay?.toLocaleString()}/day</span>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(vehicle)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button onClick={() => handleDeleteVehicle(vehicle.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </div>
              </div>
              {vehicle.features?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {vehicle.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">✓ {f}</span>
                  ))}
                  {vehicle.features.length > 3 && (
                    <span className="text-xs text-gray-500">+{vehicle.features.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No vehicles found. Click "Add New Vehicle" to get started.
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-3">
              <input type="text" placeholder="Vehicle Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Make (e.g., Toyota)" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} className="border rounded-lg p-2" />
                <input type="text" placeholder="Model (e.g., Camry)" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="border rounded-lg p-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" placeholder="Year" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="border rounded-lg p-2" />
                <input type="number" placeholder="Price per Day (₦)" value={formData.pricePerDay} onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})} className="border rounded-lg p-2" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" placeholder="Seats" value={formData.seats} onChange={(e) => setFormData({...formData, seats: e.target.value})} className="border rounded-lg p-2" />
                <select value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} className="border rounded-lg p-2">
                  <option value="AUTOMATIC">Automatic</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="border rounded-lg p-2">
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="border rounded-lg p-2">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <input type="url" placeholder="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2 h-24 resize-none" />
              
              {/* Features Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Features</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g., Air Conditioning" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="flex-1 border rounded-lg p-2" />
                  <button type="button" onClick={addFeature} className="bg-gray-200 px-4 rounded-lg">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((f, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      {f} <button type="button" onClick={() => removeFeature(f)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg flex-1">Add Vehicle</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
            <form onSubmit={handleUpdateVehicle} className="space-y-3">
              <input type="text" placeholder="Vehicle Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Make" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} className="border rounded-lg p-2" />
                <input type="text" placeholder="Model" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="border rounded-lg p-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" placeholder="Year" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="border rounded-lg p-2" />
                <input type="number" placeholder="Price per Day" value={formData.pricePerDay} onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})} className="border rounded-lg p-2" required />
              </div>
              <input type="url" placeholder="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2 h-24 resize-none" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg flex-1">Update Vehicle</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}