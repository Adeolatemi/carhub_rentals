import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [communicationNote, setCommunicationNote] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await api.get("/admin/stats").catch(() => ({ data: stats }));
      setStats(statsRes.data || stats);

      // Fetch bookings
      const bookingsRes = await api.get("/bookings").catch(() => ({ data: [] }));
      setBookings(bookingsRes.data || []);

      // Fetch orders
      const ordersRes = await api.get("/orders").catch(() => ({ data: [] }));
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action, note = "") => {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: action, adminNote: note });
      fetchAllData();
      setShowOrderModal(false);
      setSelectedOrder(null);
      setCommunicationNote("");
    } catch (error) {
      alert(error.response?.data?.error || "Error updating order");
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const StatCard = ({ title, value, icon, color }) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600",
      purple: "bg-purple-100 text-purple-600",
    };
    return (
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[color]}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      CONFIRMED: "bg-green-100 text-green-600",
      PENDING: "bg-yellow-100 text-yellow-600",
      CANCELLED: "bg-red-100 text-red-600",
      COMPLETED: "bg-blue-100 text-blue-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-6">
        Admin Dashboard
      </h1>
      
      {/* Stats Cards Row - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`₦${stats.totalRevenue?.toLocaleString() || 0}`} icon="💰" color="green" />
        <StatCard title="Total Users" value={stats.totalUsers || 0} icon="👥" color="blue" />
        <StatCard title="Total Vehicles" value={stats.totalVehicles || 0} icon="🚗" color="purple" />
        <StatCard title="Total Orders" value={stats.totalOrders || 0} icon="📦" color="yellow" />
        <StatCard title="Completed" value={stats.completedOrders || 0} icon="✅" color="green" />
        <StatCard title="Pending" value={stats.pendingOrders || 0} icon="⏳" color="yellow" />
        <StatCard title="Canceled" value={stats.canceledOrders || 0} icon="❌" color="red" />
        <StatCard title="Monthly Revenue" value={`₦${stats.monthlyRevenue?.toLocaleString() || 0}`} icon="📈" color="blue" />
      </div>

      {/* Quick Bookings Table - Mobile Responsive */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl font-bold text-primary mb-4">Quick Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-neutralLight">
                <th className="border p-2">Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2 hidden sm:table-cell">Email</th>
                <th className="border p-2">Pickup</th>
                <th className="border p-2 hidden md:table-cell">Destination</th>
                <th className="border p-2 hidden lg:table-cell">Car Type</th>
                <th className="border p-2 hidden xl:table-cell">Service Type</th>
                <th className="border p-2">Date</th>
                <th className="border p-2 hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="border p-2">{b.fullName || b.name}</td>
                  <td className="border p-2">{b.phone}</td>
                  <td className="border p-2 hidden sm:table-cell">{b.email}</td>
                  <td className="border p-2">{b.pickupLocation || b.pickup}</td>
                  <td className="border p-2 hidden md:table-cell">{b.dropoffLocation || b.destination}</td>
                  <td className="border p-2 hidden lg:table-cell">{b.carType}</td>
                  <td className="border p-2 hidden xl:table-cell">{b.serviceType}</td>
                  <td className="border p-2">{new Date(b.startDate || b.date).toLocaleDateString()}</td>
                  <td className="border p-2 hidden sm:table-cell">{b.pickupTime || b.time}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="9" className="text-center p-4 text-gray-500">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Orders Table with Actions */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-primary mb-4">Rental Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-neutralLight">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2 hidden md:table-cell">Vehicle</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2 hidden sm:table-cell">End Date</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="border p-2">{o.id?.slice(0, 8)}</td>
                  <td className="border p-2">{o.user?.name || o.fullName || o.userId}</td>
                  <td className="border p-2 hidden md:table-cell">{o.vehicle?.name || o.vehicleId}</td>
                  <td className="border p-2">{new Date(o.startDate || o.pickupDate).toLocaleDateString()}</td>
                  <td className="border p-2 hidden sm:table-cell">{new Date(o.endDate || o.dropoffDate).toLocaleDateString()}</td>
                  <td className="border p-2">₦{o.total?.toLocaleString() || o.totalAmount}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => openOrderModal(o)}
                      className="bg-primary text-white px-2 py-1 rounded text-xs hover:bg-blue-900"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="8" className="text-center p-4 text-gray-500">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Order Management Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Manage Order #{selectedOrder.id?.slice(0, 8)}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order Status</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleOrderAction(selectedOrder.id, "CONFIRMED")} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Confirm</button>
                  <button onClick={() => handleOrderAction(selectedOrder.id, "COMPLETED")} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Complete</button>
                  <button onClick={() => handleOrderAction(selectedOrder.id, "PENDING")} className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">Pending</button>
                  <button onClick={() => handleOrderAction(selectedOrder.id, "CANCELLED")} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Cancel</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Communication Note (for client)</label>
                <textarea
                  value={communicationNote}
                  onChange={(e) => setCommunicationNote(e.target.value)}
                  placeholder="Add a note about this order (e.g., payment issue, delivery instructions)..."
                  className="w-full border rounded-lg p-2 text-sm h-24 resize-none"
                />
                <button
                  onClick={() => {
                    if (communicationNote) {
                      handleOrderAction(selectedOrder.id, selectedOrder.status, communicationNote);
                    }
                  }}
                  className="mt-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Save Note
                </button>
              </div>
            </div>
            <button onClick={() => setShowOrderModal(false)} className="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;