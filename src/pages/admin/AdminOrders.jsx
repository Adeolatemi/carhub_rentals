import React, { useState, useEffect } from "react";
import api from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [communicationNote, setCommunicationNote] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: newStatus, adminNote: communicationNote });
      setShowModal(false);
      setSelectedOrder(null);
      setCommunicationNote("");
      fetchOrders();
      alert(`Order ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      alert(error.response?.data?.error || "Error updating order");
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-500 text-sm">Manage and track all customer orders</p>
      </div>

      {/* Orders Table */}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openOrderModal(order)}
                      className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-900"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Management Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Manage Order #{selectedOrder.id?.slice(0, 8)}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleStatusUpdate(selectedOrder.id, "CONFIRMED")} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Confirm</button>
                  <button onClick={() => handleStatusUpdate(selectedOrder.id, "COMPLETED")} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Complete</button>
                  <button onClick={() => handleStatusUpdate(selectedOrder.id, "PENDING")} className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">Pending</button>
                  <button onClick={() => handleStatusUpdate(selectedOrder.id, "CANCELLED")} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Cancel</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Communication Note</label>
                <textarea
                  value={communicationNote}
                  onChange={(e) => setCommunicationNote(e.target.value)}
                  placeholder="Add a note about this order (e.g., payment issue, delivery instructions)..."
                  className="w-full border rounded-lg p-2 text-sm h-24 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">This note will be visible to the customer</p>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}