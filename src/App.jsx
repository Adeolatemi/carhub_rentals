import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import BookingConfirm from "./pages/BookingConfirm";
import OurFleet from "./pages/OurFleet";
import About from "./pages/About";
import Faqs from "./pages/Faqs";
import Contact from "./pages/Contact";
import VehicleDetail from "./pages/VehicleDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PartnerLayout from "./layouts/PartnerLayout";
import PartnerDashboard from "./modules/partner/PartnerDashboard";
import PartnerVehicles from "./modules/partner/PartnerVehicles";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

// ✅ FIXED PrivateRoute with proper loading handling
function PrivateRoute({ children }) {
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
    console.log("PrivateRoute: No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("PrivateRoute: User authenticated, showing dashboard");
  return children;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20 pb-40 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/fleet" element={<OurFleet />} />
          <Route path="/fleet/:id" element={<OurFleet />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/booking/confirm" element={<BookingConfirm />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
   {/* Partner routes - PARTNER role only */}
          <Route path="/partner" element={
            <ProtectedRoute roles={["PARTNER"]}>
              <PartnerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PartnerDashboard />} />
            <Route path="dashboard" element={<PartnerDashboard />} />
            <Route path="vehicles" element={<PartnerVehicles />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <AppContent />
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}