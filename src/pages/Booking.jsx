import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SEO from "../components/SEO";

const inputCls = "border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary";
const labelCls = "block font-body text-sm font-semibold text-neutralDark mb-1";

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    pickupLocation: "",
    dropoffLocation: "",
    startDate: "",
    endDate: "",
    vehicleId: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Pre-fill form if data passed from previous page
  useEffect(() => {
    if (location.state) {
      setFormData({
        fullName: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        pickupLocation: location.state.pickup || "",
        dropoffLocation: location.state.dropoff || "",
        startDate: location.state.startDate || "",
        endDate: location.state.endDate || "",
        vehicleId: location.state.vehicleId || "",
      });
    } else if (user) {
      // Pre-fill with user data if available
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [location.state, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.pickupLocation.trim()) errors.pickupLocation = "Pickup location is required";
    if (!formData.dropoffLocation.trim()) errors.dropoffLocation = "Drop-off location is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    
    // Validate date range
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = "End date must be after start date";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("");
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setSubmitted(true);
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      setBookingMessage({ type: "error", text: "Please log in to continue" });
      setSubmitted(false);
      navigate("/login");
      return;
    }
    
    try {
      const response = await fetch("https://server-icy-grass-4740.fly.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          pickupLocation: formData.pickupLocation.trim(),
          dropoffLocation: formData.dropoffLocation.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          vehicleId: formData.vehicleId || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.ok) {
        setBookingMessage({ 
          type: "success", 
          text: "✅ Booking created successfully! Redirecting to dashboard..." 
        });
        
        console.log("Booking successful, order ID:", data.order?.id);
        
        // ✅ Use window.location for reliable redirect
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setBookingMessage({ 
          type: "error", 
          text: data.error || "Booking failed. Please try again." 
        });
        setSubmitted(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingMessage({ 
        type: "error", 
        text: "Network error. Please check your connection and try again." 
      });
      setSubmitted(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <section className="bg-neutralLight min-h-screen py-12 px-4">
      <SEO
        title="Book a Car — CarHub Nigeria"
        description="Book a car online with CarHub. Choose your pickup location, date, and vehicle type. Fast, easy, secure booking."
        path="/booking"
      />
      
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl font-extrabold mb-2 text-center text-primary">
          Book Your Ride
        </h2>
        <p className="font-body text-center text-gray-400 text-sm mb-8">
          Fill in the details below and we'll get you moving.
        </p>

        {bookingMessage && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            bookingMessage.type === "success" 
              ? "bg-green-50 text-green-600 border border-green-200" 
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {bookingMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className={labelCls}>Full Name <span className="text-accent">*</span></label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className={inputCls}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>Phone Number <span className="text-accent">*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. 08012345678"
              value={formData.phone}
              onChange={handleChange}
              className={inputCls}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>Email Address <span className="text-accent">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@email.com"
              value={formData.email}
              onChange={handleChange}
              className={inputCls}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Pickup Location */}
          <div>
            <label className={labelCls}>Pickup Location <span className="text-accent">*</span></label>
            <input
              type="text"
              name="pickupLocation"
              placeholder="e.g. Murtala Muhammed Airport, Lagos"
              value={formData.pickupLocation}
              onChange={handleChange}
              className={inputCls}
            />
            {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>}
          </div>

          {/* Drop-off Location */}
          <div>
            <label className={labelCls}>Drop-off Location <span className="text-accent">*</span></label>
            <input
              type="text"
              name="dropoffLocation"
              placeholder="e.g. Victoria Island, Lagos"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className={inputCls}
            />
            {errors.dropoffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation}</p>}
          </div>

          {/* Start Date */}
          <div>
            <label className={labelCls}>Start Date <span className="text-accent">*</span></label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputCls}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className={labelCls}>End Date <span className="text-accent">*</span></label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputCls}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>

          {/* Vehicle ID (hidden if not provided) */}
          {formData.vehicleId && (
            <input type="hidden" name="vehicleId" value={formData.vehicleId} />
          )}

          <button
            type="submit"
            disabled={submitted}
            className="col-span-2 bg-primary text-white py-3 rounded-lg font-heading font-bold tracking-wide hover:bg-blue-900 transition disabled:opacity-60"
          >
            {submitted ? "Processing..." : "Book My Ride Now"}
          </button>
        </form>
      </div>
    </section>
  );
}