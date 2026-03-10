import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <nav>
          <Link to="/">Home</Link> | <Link to="/vehicles">Vehicles</Link> | <Link to="/profile">Profile</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
