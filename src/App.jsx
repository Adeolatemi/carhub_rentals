
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import OurFleet from "./pages/OurFleet";
import About from "./pages/About";
import VehicleDetail from "./pages/VehicleDetail";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";


function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppLayout() {
  return (
    <>
      <Header />

      <div className="pt-24 min-h-screen bg-gray-100">
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />

          {/* Fleet */}
          <Route path="/fleet/:id" element={<OurFleet />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />

          {/* Booking - Public access, login required on submission */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:vehicleId" element={<Booking />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
