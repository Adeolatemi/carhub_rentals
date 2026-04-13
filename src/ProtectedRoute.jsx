import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    console.log(`ProtectedRoute: User role ${user.role} not authorized for ${roles.join(", ")}`);
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
}