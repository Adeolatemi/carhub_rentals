import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/partner/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/partner/vehicles", label: "My Fleet",   icon: "🚗" },
  { to: "/partner/orders",   label: "Bookings",   icon: "📋" },
];

export default function PartnerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutralLight">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary text-white flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-heading text-xl font-extrabold tracking-wide">CarHub</p>
          <p className="font-body text-xs text-white/50 mt-1">Partner Portal</p>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-heading font-bold text-primary text-lg">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-body text-sm font-semibold truncate">{user?.name}</p>
              <p className="font-body text-xs text-white/50">Fleet Partner</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-semibold transition
                ${location.pathname === to || (to === "/partner/dashboard" && location.pathname === "/partner")
                  ? "bg-white/20 text-white shadow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-6 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <span>🌐</span> View Site
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between md:justify-end">
          <button
            className="md:hidden text-primary font-bold text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <p className="font-body text-sm text-gray-400">
            Welcome back, <span className="font-semibold text-primary">{user?.name}</span>
          </p>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
