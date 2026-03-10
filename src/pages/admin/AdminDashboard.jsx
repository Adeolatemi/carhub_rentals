import React, { useEffect, useState } from "react";
import { admin } from "../../api";

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
}
