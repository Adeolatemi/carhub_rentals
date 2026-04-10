import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/index.js";

export default function PartnerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/vehicles?my=true"),
      api.get("/orders?my=true"),
    ])
      .then(([v, o]) => {
        setVehicles(v.data || []);
        setOrders(o.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const available = vehicles.filter((v) => v.available).length;
  const booked = vehicles.filter((v) => !v.available).length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const confirmed = orders.filter((o) => o.status === "CONFIRMED").length;

  const stats = [
    { label: "Total Vehicles", value: vehicles.length, icon: "🚗", color: "bg-blue-50 text-primary" },
    { label: "Available",      value: available,        icon: "✅", color: "bg-green-50 text-green-700" },
    { label: "Booked",         value: booked,           icon: "📅", color: "bg-yellow-50 text-yellow-700" },
    { label: "Pending Orders", value: pending,          icon: "⏳", color: "bg-orange-50 text-orange-700" },
    { label: "Confirmed Orders", value: confirmed,      icon: "✔️", color: "bg-green-50 text-green-700" },
  ];

  if (loading) return <div className="font-body text-gray-400 py-12 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-primary">Dashboard</h1>
        <p className="font-body text-sm text-gray-400 mt-1">Overview of your fleet and bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="font-heading text-3xl font-extrabold">{s.value}</p>
            <p className="font-body text-sm mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-primary">Recent Bookings</h2>
          <Link to="/partner/orders" className="font-body text-xs text-accent hover:underline">View all</Link>
        </div>

        {orders.length === 0 ? (
          <p className="font-body text-sm text-gray-400 py-6 text-center">No bookings yet on your fleet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-3 font-semibold">Ref</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Pickup</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 font-semibold text-primary">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 text-gray-600">{o.fullName || "—"}</td>
                    <td className="py-3 text-gray-600">{o.pickupLocation || "—"}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${o.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                          o.status === "PENDING"   ? "bg-yellow-100 text-yellow-700" :
                          o.status === "CANCELED"  ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-600"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 flex-wrap">
        <Link to="/partner/vehicles" className="bg-primary text-white font-heading font-bold px-6 py-3 rounded-xl hover:bg-blue-900 transition text-sm">
          + Add Vehicle
        </Link>
        <Link to="/partner/orders" className="border border-primary text-primary font-heading font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
          View All Bookings
        </Link>
      </div>
    </div>
  );
}
