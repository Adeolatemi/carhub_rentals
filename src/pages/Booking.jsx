// src/pages/Booking.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Webcam from 'react-webcam';

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  
  // Data from API
  const [carTypes, setCarTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    pickupLocation: '',
    destination: '',
    carTypeId: '',
    serviceType: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    specialRequests: '',
    driverRequired: false,
    driverLicenseNumber: '',
    totalDays: 1
  });
  
  // File uploads
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [nepaBillFile, setNepaBillFile] = useState(null);
  const [faceVerificationResult, setFaceVerificationResult] = useState(null);
  
  useEffect(() => {
    fetchCarTypes();
    fetchServiceTypes();
    fetchLocations();
  }, []);
  
  useEffect(() => {
    if (formData.pickupDate) {
      calculateDays();
    }
  }, [formData.pickupDate]);
  
  useEffect(() => {
    if (formData.carTypeId && formData.totalDays) {
      calculatePrice();
    }
  }, [formData.carTypeId, formData.totalDays, formData.driverRequired]);
  
  const fetchCarTypes = async () => {
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/car-types');
      const data = await response.json();
      setCarTypes(data);
    } catch (error) {
      console.error('Error fetching car types:', error);
    }
  };
  
  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/service-types');
      const data = await response.json();
      setServiceTypes(data);
    } catch (error) {
      console.error('Error fetching service types:', error);
    }
  };
  
  const fetchLocations = async () => {
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };
  
  const calculateDays = () => {
    const pickup = new Date(formData.pickupDate);
    const today = new Date();
    const diffTime = Math.abs(pickup - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setFormData(prev => ({ ...prev, totalDays: diffDays || 1 }));
  };
  
  const calculatePrice = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carTypeId: formData.carTypeId,
          totalDays: formData.totalDays,
          driverRequired: formData.driverRequired
        })
      });
      const data = await response.json();
      setPriceBreakdown(data);
    } catch (error) {
      console.error('Price calculation error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'driverLicense') {
      setDriverLicenseFile(file);
    } else if (type === 'nepaBill') {
      setNepaBillFile(file);
    }
  };
  
  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          setSelfieFile(file);
          setCapturedSelfie(imageSrc);
          setShowWebcam(false);
        });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (!formData.carTypeId) {
      setError('Please select a car type');
      setLoading(false);
      return;
    }
    
    if (formData.driverRequired && !driverLicenseFile) {
      setError('Please upload your driver\'s license');
      setLoading(false);
      return;
    }
    
    if (formData.driverRequired && !selfieFile) {
      setError('Please take a selfie for verification');
      setLoading(false);
      return;
    }
    
    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('pickupLocation', formData.pickupLocation);
    submitData.append('destination', formData.destination);
    submitData.append('carTypeId', formData.carTypeId);
    submitData.append('serviceType', formData.serviceType);
    submitData.append('pickupDate', formData.pickupDate);
    submitData.append('pickupTime', formData.pickupTime);
    submitData.append('passengers', formData.passengers);
    submitData.append('specialRequests', formData.specialRequests);
    submitData.append('driverRequired', formData.driverRequired);
    submitData.append('driverLicenseNumber', formData.driverLicenseNumber);
    submitData.append('totalDays', formData.totalDays);
    
    if (driverLicenseFile) {
      submitData.append('driverLicense', driverLicenseFile);
    }
    if (selfieFile) {
      submitData.append('selfie', selfieFile);
    }
    if (nepaBillFile) {
      submitData.append('nepaBill', nepaBillFile);
    }
    
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/create', {
        method: 'POST',
        body: submitData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFaceVerificationResult({
          verified: data.faceVerified,
          score: data.faceMatchScore,
          licenseVerified: data.licenseVerified
        });
        
        // Redirect to Paystack payment page
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-2">Book Your Ride</h1>
      <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you immediately</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Pickup Location *</label>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select pickup location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter destination (optional)"
            />
          </div>
          
          {/* Car Type Dropdown */}
          <div>
            <label className="block font-semibold mb-2">Car Type *</label>
            <select
              name="carTypeId"
              value={formData.carTypeId}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select car type</option>
              {carTypes.map(car => (
                <option key={car.id} value={car.id}>
                  {car.name} - ₦{car.dailyRate.toLocaleString()}/day (Max {car.capacity} persons)
                </option>
              ))}
            </select>
          </div>
          
          {/* Service Type Dropdown */}
          <div>
            <label className="block font-semibold mb-2">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select service type</option>
              {serviceTypes.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Pickup Date *</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Pickup Time *</label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
          
          {/* Passengers Dropdown */}
          <div>
            <label className="block font-semibold mb-2">Number of Passengers</label>
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              {[...Array(50).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'passenger' : 'passengers'}</option>
              ))}
            </select>
          </div>
          
          {/* Special Requests */}
          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg p-3"
              placeholder="Any special requirements or additional information (max 500 characters)"
              maxLength="500"
            />
            <p className="text-right text-sm text-gray-500">
              {formData.specialRequests.length}/500 characters
            </p>
          </div>
        </div>
        
        {/* Driver Option */}
        <div className="border rounded-lg p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="driverRequired"
              checked={formData.driverRequired}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span className="font-semibold">I need a driver (₦10,000/day)</span>
          </label>
        </div>
        
        {/* Driver's License Upload (if driver required) */}
        {formData.driverRequired && (
          <div className="border rounded-lg p-6">
            <label className="block font-semibold mb-2">Driver's License Upload *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'driverLicense')}
              required
              className="w-full border rounded-lg p-2"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a clear image of your driver's license for verification</p>
            
            <div className="mt-4">
              <label className="block font-semibold mb-2">Driver's License Number</label>
              <input
                type="text"
                name="driverLicenseNumber"
                value={formData.driverLicenseNumber}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="e.g., DL-1234567890"
              />
            </div>
            
            {/* Selfie Capture */}
            <div className="mt-4">
              <label className="block font-semibold mb-2">Take a Selfie for Verification *</label>
              {!showWebcam && !capturedSelfie && (
                <button
                  type="button"
                  onClick={() => setShowWebcam(true)}
                  className="bg-gray-100 border-2 border-dashed rounded-lg p-6 text-center w-full hover:bg-gray-50"
                >
                  <div className="text-4xl mb-2">📸</div>
                  <p>Click to take a selfie</p>
                  <p className="text-sm text-gray-500 mt-1">We'll verify that you match your driver's license</p>
                </button>
              )}
              
              {showWebcam && (
                <div className="text-center">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full rounded-lg mb-3"
                  />
                  <button
                    type="button"
                    onClick={captureSelfie}
                    className="bg-primary text-white px-6 py-2 rounded-lg"
                  >
                    Capture Selfie
                  </button>
                </div>
              )}
              
              {capturedSelfie && (
                <div className="text-center">
                  <img src={capturedSelfie} alt="Selfie" className="w-32 h-32 object-cover rounded-full mx-auto mb-2" />
                  <p className="text-green-600 text-sm">✓ Selfie captured</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* NEPA Bill Upload (optional) */}
        <div className="border rounded-lg p-6">
          <label className="block font-semibold mb-2">NEPA Bill (Last 3 months) - Optional</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e, 'nepaBill')}
            className="w-full border rounded-lg p-2"
          />
          <p className="text-sm text-gray-500 mt-1">Upload a recent electricity bill for address verification (optional)</p>
        </div>
        
        {/* Face Verification Result */}
        {faceVerificationResult && (
          <div className={`p-4 rounded-lg ${faceVerificationResult.verified ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={faceVerificationResult.verified ? 'text-green-600' : 'text-red-600'}>
              {faceVerificationResult.verified 
                ? `✅ Face verification successful! (Match score: ${Math.round(faceVerificationResult.score * 100)}%)` 
                : `❌ Face verification failed. Please ensure your selfie matches your license photo.`}
            </p>
          </div>
        )}
        
        {/* Price Summary */}
        {priceBreakdown && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{formData.totalDays} day(s) × ₦{priceBreakdown.dailyRate?.toLocaleString()}</span>
                <span>₦{priceBreakdown.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (7.5%)</span>
                <span>₦{priceBreakdown.vat?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (0.5%)</span>
                <span>₦{priceBreakdown.tax?.toLocaleString()}</span>
              </div>
              {formData.driverRequired && (
                <div className="flex justify-between text-gray-600">
                  <span>Driver Fee (₦10,000/day)</span>
                  <span>₦{priceBreakdown.driverFee?.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₦{priceBreakdown.grandTotal?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
}