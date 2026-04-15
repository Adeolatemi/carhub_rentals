import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const menuItems = [
  { path: "/admin", icon: "📊", label: "Dashboard" },
  { path: "/admin/users", icon: "👥", label: "Users & Access" },
  { path: "/admin/vehicles", icon: "🚗", label: "Vehicles" },
  { path: "/admin/orders", icon: "📦", label: "Orders" },
  { path: "/admin/settings", icon: "⚙️", label: "Settings" },
];

export default function AdminSidebar() {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-primary">CarHub Admin</h1>
        <p className="text-xs text-gray-500 mt-1">{user?.role} Portal</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          CarHub Admin Portal v1.0
        </div>
      </div>
    </div>
  );
}