import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("Dashboard loaded successfully");
    console.log("User:", user?.email);
  }, [user]);

  // If no user, show loading (shouldn't happen due to ProtectedRoute)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutralLight flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
        <p className="font-body text-sm uppercase tracking-widest text-accent font-semibold mb-2">
          Hi, {user?.name} 👋
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-primary mb-3">
          Welcome back!
        </h1>
        <p className="font-body text-gray-500 text-lg mb-8">
          You can now book a ride.{" "}
          <Link
            to="/booking"
            className="text-accent font-semibold underline underline-offset-4 hover:text-yellow-600 transition-colors duration-200"
          >
            Book here.
          </Link>
        </p>
        <div className="h-1 w-16 bg-accent rounded-full mx-auto" />
      </div>
    </div>
  );
}