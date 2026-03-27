import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PartnerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/partner/dashboard" className="text-xl font-bold text-gray-900">
                CarHub Partner
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm border-r">
          <nav className="p-6 space-y-2">
            <Link to="/partner/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">
              Dashboard
            </Link>
            <Link to="/partner/vehicles" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">
              My Fleet
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
