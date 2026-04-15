import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { AdminProvider } from "./contexts/AdminContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterPopup from "./components/NewsLetterPopup";
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

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";

// ✅ Admin Route Guard - only SUPERADMIN and ADMIN can access
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log("AdminRoute: No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin role
  const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMIN";
  if (!isAdmin) {
    console.log("AdminRoute: User role", user.role, "not authorized for admin");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("AdminRoute: User authorized as", user.role);
  return children;
}

// PrivateRoute component
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
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
  
  if (!user) {
    console.log("PrivateRoute: No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("PrivateRoute: User authenticated, showing protected content");
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

          {/* Protected user routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Partner routes */}
          <Route 
            path="/partner" 
            element={
              <ProtectedRoute roles={["PARTNER"]}>
                <PartnerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PartnerDashboard />} />
            <Route path="dashboard" element={<PartnerDashboard />} />
            <Route path="vehicles" element={<PartnerVehicles />} />
          </Route>

          {/* Admin routes - protected with AdminRoute */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 - Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <NewsletterPopup />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <AdminProvider>
            <Router>
              <AppContent />
            </Router>
          </AdminProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}