import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function PartnerLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 220, padding: 16, borderRight: '1px solid #ddd' }}>
        <h3>Partner</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/partner">Dashboard</Link></li>
          <li><Link to="/partner/vehicles">Vehicles</Link></li>
          <li><Link to="/partner/orders">Orders</Link></li>
        </ul>
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
