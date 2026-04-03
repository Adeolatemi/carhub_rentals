import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/index.js";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then((r) => setVehicle(r.data))
      .catch(() => setMsg("Failed to load vehicle"));
  }, [id]);

  if (!vehicle) return (
    <div className="min-h-screen flex items-center justify-center font-body text-gray-400">
      {msg || "Loading..."}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {vehicle.imageUrl && (
        <img src={vehicle.imageUrl} alt={vehicle.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
      )}
      <h1 className="font-heading text-3xl font-extrabold text-primary mb-2">{vehicle.title}</h1>
      {vehicle.description && <p className="font-body text-gray-500 mb-4">{vehicle.description}</p>}
      <p className="font-body text-xl font-bold text-accent mb-8">₦{Number(vehicle.dailyRate).toLocaleString()}/day</p>
      <button
        onClick={() => navigate("/booking", { state: { vehicleId: vehicle.id } })}
        className="bg-primary text-white font-heading font-bold px-8 py-3 rounded-xl hover:bg-blue-900 transition"
      >
        Book Now
      </button>
      {msg && <p className="text-red-500 font-body text-sm mt-4">{msg}</p>}
    </div>
  );
}
