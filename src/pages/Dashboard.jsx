import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log("Dashboard mounted");
    console.log("Loading state:", loading);
    console.log("User state:", user?.email);
    
    // Check if we just came from booking
    const justBooked = localStorage.getItem("just_booked");
    console.log("Just booked flag:", justBooked);
    
    if (justBooked === "true") {
      console.log("Clearing just_booked flag");
      localStorage.removeItem("just_booked");
      setHasRedirected(true);
    }
  }, [user, loading]);

  // Show loading while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  // If no user, show message (ProtectedRoute should prevent this)
  if (!user) {
    console.log("No user in dashboard - this shouldn't happen");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please wait...</p>
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
            onClick={() => console.log("Navigating to booking")}
          >
            Book here.
          </Link>
        </p>
        <div className="h-1 w-16 bg-accent rounded-full mx-auto" />
      </div>
    </div>
  );
}