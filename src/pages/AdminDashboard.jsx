import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch quick bookings
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));

    // Fetch full orders
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="pt-32 max-w-7xl mx-auto px-6">
      <h1 className="font-heading text-4xl font-bold text-primary mb-10 text-center">
        Admin Dashboard
      </h1>

      {/* Quick Bookings Table */}
      <section className="mb-16">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6">
          Quick Bookings
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-neutralLight">
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Pickup</th>
              <th className="border p-2">Destination</th>
              <th className="border p-2">Car Type</th>
              <th className="border p-2">Service Type</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="border p-2">{b.fullName}</td>
                <td className="border p-2">{b.phone}</td>
                <td className="border p-2">{b.email}</td>
                <td className="border p-2">{b.pickup}</td>
                <td className="border p-2">{b.destination}</td>
                <td className="border p-2">{b.carType}</td>
                <td className="border p-2">{b.serviceType}</td>
                <td className="border p-2">{new Date(b.date).toLocaleDateString()}</td>
                <td className="border p-2">{b.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Orders Table */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-primary mb-6">
          Rental Orders
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-neutralLight">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Vehicle</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="border p-2">{o.id}</td>
                <td className="border p-2">{o.user?.name || o.userId}</td>
                <td className="border p-2">{o.vehicle?.title || o.vehicleId}</td>
                <td className="border p-2">{new Date(o.startDate).toLocaleDateString()}</td>
                <td className="border p-2">{new Date(o.endDate).toLocaleDateString()}</td>
                <td className="border p-2">₦{o.totalAmount}</td>
                <td className="border p-2">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;