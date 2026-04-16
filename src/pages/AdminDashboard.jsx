import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // ✅ FIXED: Use correct admin endpoints
      const [statsRes, bookingsRes, ordersRes] = await Promise.all([
        api.get("/admin/stats").catch(() => ({ data: stats })),
        api.get("/admin/bookings").catch(() => ({ data: [] })),
        api.get("/admin/orders").catch(() => ({ data: [] })),
      ]);
      
      setStats(statsRes.data || stats);
      setBookings(bookingsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}`, { status: newStatus });
      setShowBookingModal(false);
      fetchAllData();
      alert(`Booking ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      alert(error.response?.data?.error || "Error updating booking");
    }
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
      <div className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
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
      COMPLETED: "bg-blue-100 text-blue-600",
      PENDING: "bg-yellow-100 text-yellow-600",
      CANCELLED: "bg-red-100 text-red-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
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
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
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

      {/* Quick Bookings Section */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl font-bold text-primary mb-4">Quick Bookings</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Dropoff</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleBookingClick(booking)}>
                    <td className="px-4 py-3 text-gray-600">{booking.fullName || booking.name}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.phone}</td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{booking.email}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.pickupLocation || booking.pickup}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{booking.dropoffLocation || booking.destination}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(booking.startDate || booking.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(booking.status || "PENDING")}`}>
                        {booking.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleBookingClick(booking); }}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-900"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center p-8 text-gray-500">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Orders Table */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-primary mb-4">Rental Orders</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/orders?orderId=${order.id}`)}>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{order.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-gray-600">{order.user?.name || order.fullName}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{order.vehicle?.title || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">₦{order.total?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Booking Management Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Manage Booking</h2>
            <div className="space-y-3">
              <p><strong>Customer:</strong> {selectedBooking.fullName || selectedBooking.name}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Pickup:</strong> {selectedBooking.pickupLocation || selectedBooking.pickup}</p>
              <p><strong>Dropoff:</strong> {selectedBooking.dropoffLocation || selectedBooking.destination}</p>
              <p><strong>Date:</strong> {new Date(selectedBooking.startDate || selectedBooking.date).toLocaleDateString()}</p>
              
              <div className="pt-4">
                <label className="block text-sm font-medium mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleUpdateBookingStatus(selectedBooking.id, "CONFIRMED")} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Confirm</button>
                  <button onClick={() => handleUpdateBookingStatus(selectedBooking.id, "COMPLETED")} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Complete</button>
                  <button onClick={() => handleUpdateBookingStatus(selectedBooking.id, "PENDING")} className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">Pending</button>
                  <button onClick={() => handleUpdateBookingStatus(selectedBooking.id, "CANCELLED")} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Cancel</button>
                </div>
              </div>
            </div>
            <button onClick={() => setShowBookingModal(false)} className="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}