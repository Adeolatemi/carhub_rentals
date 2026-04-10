import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../api/index.js";
import countryCodes from "../data/countryCodes.js";
import SEO from "../components/SEO";

const timeOptions = Array.from({ length: 24 }, (_, h) =>
  ["00", "30"].map((m) => {
    const val = `${String(h).padStart(2, "0")}:${m}`;
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? "AM" : "PM";
    return { val, label: `${String(hour12).padStart(2, "0")}:${m} ${ampm}` };
  })
).flat();

const inputCls = "border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary";
const labelCls = "block font-body text-sm font-semibold text-neutralDark mb-1";

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [phonePrefix, setPhonePrefix] = useState("+234");
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIdFile(file);
    setIdPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropoffLocation: "",
    dropoffDate: "",
    dropoffTime: "",
    carType: "",
    serviceType: "",
    driver: "",
    passengers: "",
    requests: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (location.state) {
      const nameParts = (location.state.name || "").split(" ");
      setFormData((prev) => ({ // eslint-disable-line react-hooks/set-state-in-effect
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phone: location.state.phone || "",
        pickupLocation: location.state.pickup || "",
        pickupDate: location.state.date || "",
        pickupTime: location.state.time || "",
        dropoffLocation: location.state.destination || "",
        dropoffDate: location.state.date || "",
        dropoffTime: location.state.time || "",
        carType: location.state.carType || "",
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName) e.firstName = "First name is required";
    if (!formData.lastName) e.lastName = "Last name is required";
    if (!formData.phone) e.phone = "Phone number is required";
    if (!formData.email) e.email = "Email is required";
    if (!formData.pickupLocation) e.pickupLocation = "Pickup location is required";
    if (!formData.pickupDate) e.pickupDate = "Pickup date is required";
    if (!formData.pickupTime) e.pickupTime = "Pickup time is required";
    if (!formData.dropoffLocation) e.dropoffLocation = "Drop-off location is required";
    if (!formData.dropoffDate) e.dropoffDate = "Drop-off date is required";
    if (!formData.dropoffTime) e.dropoffTime = "Drop-off time is required";
    if (!formData.carType) e.carType = "Car type is required";
    if (!formData.serviceType) e.serviceType = "Service type is required";
    if (!formData.driver) e.driver = "Please select driver preference";
    if (!idFile) e.idFile = "Please upload a valid ID document";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
    try {
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("phone", `${phonePrefix}${formData.phone}`);
      form.append("pickupLocation", formData.pickupLocation);
      form.append("dropoffLocation", formData.dropoffLocation);
      form.append("pickupDate", formData.pickupDate);
      form.append("pickupTime", formData.pickupTime);
      form.append("dropoffDate", formData.dropoffDate);
      form.append("dropoffTime", formData.dropoffTime);
      form.append("carType", formData.carType);
      form.append("serviceType", formData.serviceType);
      form.append("driver", formData.driver);
      if (formData.passengers) form.append("passengers", formData.passengers);
      if (formData.requests) form.append("requests", formData.requests);
      if (location.state?.vehicleId) form.append("vehicleId", location.state.vehicleId);
      if (idFile) form.append("idDocument", idFile);

      const { data } = await api.post("/orders/request", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error("Booking failed:", error);
      setErrors({ submit: error.response?.data?.error || "Booking failed. Please try again." });
      setSubmitted(false);
    }
  };

  return (
    <section className="bg-neutralLight min-h-screen py-12 px-4">
      <SEO
        title="Book a Car â€” Car Rental Lagos | CarHub"
        description="Book a car online with CarHub Lagos. Choose your pickup location, date, time, car type and driver preference. Fast, easy, secure booking."
        path="/booking"
      />
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl font-extrabold mb-2 text-center text-primary">
          Book Your Ride
        </h2>
        <p className="font-body text-center text-gray-400 text-sm mb-8">
          Fill in the details below and we'll get you moving.
        </p>

        {errors.submit && (
          <p className="text-red-600 font-body text-center mb-4 p-4 bg-red-50 rounded">
            âŒ {errors.submit}
          </p>
        )}
        {submitted && !errors.submit && (
          <p className="text-green-600 font-body text-center mb-4 p-4 bg-green-50 rounded">
            âœ… Redirecting to payment...
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* First Name */}
          <div>
            <label className={labelCls}>First Name <span className="text-accent">*</span></label>
            <input
              type="text" name="firstName" placeholder="e.g. John"
              value={formData.firstName} onChange={handleChange} className={inputCls}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className={labelCls}>Last Name <span className="text-accent">*</span></label>
            <input
              type="text" name="lastName" placeholder="e.g. Doe"
              value={formData.lastName} onChange={handleChange} className={inputCls}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          {/* Phone with country prefix */}
          <div>
            <label className={labelCls}>Phone Number <span className="text-accent">*</span></label>
            <div className="flex gap-2">
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary w-36 shrink-0"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.prefix}>
                    {c.code} {c.prefix}
                  </option>
                ))}
              </select>
              <input
                type="tel" name="phone" placeholder="801 234 5678"
                value={formData.phone} onChange={handleChange}
                className={inputCls}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>Email Address <span className="text-accent">*</span></label>
            <input
              type="email" name="email" placeholder="e.g. john@email.com"
              value={formData.email} onChange={handleChange} className={inputCls}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Pickup Location */}
          <div>
            <label className={labelCls}>Pickup Location <span className="text-accent">*</span></label>
            <input
              type="text" name="pickupLocation" placeholder="e.g. Murtala Muhammed Airport, Lagos"
              value={formData.pickupLocation} onChange={handleChange} className={inputCls}
            />
            {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>}
          </div>

          {/* Drop-off Location */}
          <div>
            <label className={labelCls}>Drop-off Location <span className="text-accent">*</span></label>
            <input
              type="text" name="dropoffLocation" placeholder="e.g. Victoria Island, Lagos"
              value={formData.dropoffLocation} onChange={handleChange} className={inputCls}
            />
            {errors.dropoffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation}</p>}
          </div>

          {/* Pickup Date */}
          <div>
            <label className={labelCls}>Pickup Date <span className="text-accent">*</span></label>
            <input
              type="date" name="pickupDate"
              value={formData.pickupDate} onChange={handleChange} className={inputCls}
            />
            {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
          </div>

          {/* Pickup Time */}
          <div>
            <label className={labelCls}>Pickup Time <span className="text-accent">*</span></label>
            <select name="pickupTime" value={formData.pickupTime} onChange={handleChange} className={inputCls}>
              <option value="">Select pickup time</option>
              {timeOptions.map(({ val, label }) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            {errors.pickupTime && <p className="text-red-500 text-xs mt-1">{errors.pickupTime}</p>}
          </div>

          {/* Drop-off Date */}
          <div>
            <label className={labelCls}>Drop-off Date <span className="text-accent">*</span></label>
            <input
              type="date" name="dropoffDate"
              value={formData.dropoffDate} onChange={handleChange} className={inputCls}
            />
            {errors.dropoffDate && <p className="text-red-500 text-xs mt-1">{errors.dropoffDate}</p>}
          </div>

          {/* Drop-off Time */}
          <div>
            <label className={labelCls}>Drop-off Time <span className="text-accent">*</span></label>
            <select name="dropoffTime" value={formData.dropoffTime} onChange={handleChange} className={inputCls}>
              <option value="">Select drop-off time</option>
              {timeOptions.map(({ val, label }) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            {errors.dropoffTime && <p className="text-red-500 text-xs mt-1">{errors.dropoffTime}</p>}
          </div>

          {/* Car Type */}
          <div>
            <label className={labelCls}>Car Type <span className="text-accent">*</span></label>
            <select name="carType" value={formData.carType} onChange={handleChange} className={inputCls}>
              <option value="">Select car type</option>
              <option>Saloon</option>
              <option>SUV</option>
              <option>Luxury Sedan</option>
              <option>Bus</option>
            </select>
            {errors.carType && <p className="text-red-500 text-xs mt-1">{errors.carType}</p>}
          </div>

          {/* Service Type */}
          <div>
            <label className={labelCls}>Service Type <span className="text-accent">*</span></label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} className={inputCls}>
              <option value="">Select service type</option>
              <option>Airport Transfer</option>
              <option>Wedding</option>
              <option>Corporate Event</option>
              <option>City Tour</option>
              <option>Others</option>
            </select>
            {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
          </div>

          {/* Driver */}
          <div>
            <label className={labelCls}>Driver Required? <span className="text-accent">*</span></label>
            <select name="driver" value={formData.driver} onChange={handleChange} className={inputCls}>
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.driver && <p className="text-red-500 text-xs mt-1">{errors.driver}</p>}
          </div>

          {/* ID Upload */}
          <div className="col-span-2">
            <label className={labelCls}>
              Driver's Licence / ID Document <span className="text-accent">*</span>
            </label>
            <p className="text-xs text-gray-400 font-body mb-2">
              Upload your Driver's Licence, National ID, International Passport or any valid means of identification.
            </p>

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Clickable upload zone */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-blue-50 transition"
            >
              {idPreview ? (
                <img src={idPreview} alt="ID preview" className="h-28 object-contain rounded-lg pointer-events-none" />
              ) : idFile ? (
                <div className="flex flex-col items-center gap-1 pointer-events-none">
                  <span className="text-3xl">ðŸ“„</span>
                  <span className="text-sm font-body text-gray-600">{idFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400 pointer-events-none">
                  <span className="text-3xl">ðŸ“</span>
                  <span className="text-sm font-body">Click to upload (JPG, PNG, PDF)</span>
                  <span className="text-xs font-body">Max 5MB</span>
                </div>
              )}
            </div>

            {idFile && (
              <button
                type="button"
                onClick={() => { setIdFile(null); setIdPreview(null); fileInputRef.current.value = ""; }}
                className="mt-2 text-xs text-red-500 hover:underline font-body"
              >
                âœ• Remove file
              </button>
            )}
            {errors.idFile && <p className="text-red-500 text-xs mt-1">{errors.idFile}</p>}
          </div>

          {/* Passengers */}
          <div>
            <label className={labelCls}>Passengers</label>
            <input
              type="number" name="passengers" placeholder="e.g. 3" min="1"
              value={formData.passengers} onChange={handleChange} className={inputCls}
            />
          </div>

          {/* Special Requests */}
          <div className="col-span-2">
            <label className={labelCls}>Special Requests</label>
            <textarea
              name="requests" placeholder="Any special requests or notes..."
              maxLength={500} value={formData.requests} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg font-body w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <button
            type="submit"
            className="col-span-2 bg-primary text-white py-3 rounded-lg font-heading font-bold tracking-wide hover:bg-blue-900 transition disabled:opacity-60"
            disabled={submitted}
          >
            Book My Ride Now
          </button>
        </form>
      </div>
    </section>
  );
}
