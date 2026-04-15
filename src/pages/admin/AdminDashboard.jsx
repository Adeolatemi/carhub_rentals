import React, { useEffect, useState } from "react";
import { admin } from "../../api";
import StatsCard from "../../components/admin/StatsCard";
export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    admin.overview().then(setMetrics).catch(console.error);
  }, []);

  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div>
      <h2>Overview</h2>
      <ul>
        <li>Total users: {metrics.totalUsers}</li>
        <li>Total vehicles: {metrics.totalVehicles}</li>
        <li>Total orders: {metrics.totalOrders}</li>
        <li>Completed orders: {metrics.completedOrders}</li>
        <li>Pending orders: {metrics.pendingOrders}</li>
        <li>Canceled orders: {metrics.canceledOrders}</li>
        <li>Monthly revenue: ₦{metrics.monthlyRevenue}</li>
      </ul>
    </div>
  );
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <StatsCard title="Total Revenue" value={`₦${stats.totalRevenue?.toLocaleString() || 0}`} icon="💰" color="green" />
  <StatsCard title="Total Users" value={stats.totalUsers || 0} icon="👥" color="blue" />
  <StatsCard title="Total Vehicles" value={stats.totalVehicles || 0} icon="🚗" color="purple" />
  <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon="📦" color="yellow" />
  <StatsCard title="Completed" value={stats.completedOrders || 0} icon="✅" color="green" />
  <StatsCard title="Pending" value={stats.pendingOrders || 0} icon="⏳" color="yellow" />
  <StatsCard title="Canceled" value={stats.canceledOrders || 0} icon="❌" color="red" />
  <StatsCard title="Monthly Revenue" value={`₦${stats.monthlyRevenue?.toLocaleString() || 0}`} icon="📈" color="blue" />
</div>
}
