// src/pages/EnhancedBooking.jsx
import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

export default function EnhancedBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [dates, setDates] = useState({ start: '', end: '' });
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [driverRequired, setDriverRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Document upload states
  const [documents, setDocuments] = useState({
    idDocument: null,
    utilityBill: null,
    driverLicense: null,
    selfie: null
  });
  
  const [verification, setVerification] = useState({
    licenseNumber: '',
    licenseDob: '',
    utilityAddress: ''
  });
  
  const [selfieMode, setSelfieMode] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [livenessInstruction, setLivenessInstruction] = useState('Look straight at the camera');
  const [livenessStep, setLivenessStep] = useState(0);
  
  const livenessInstructions = [
    'Look straight at the camera',
    'Blink your eyes',
    'Open your mouth slightly',
    'Turn your head left',
    'Turn your head right',
    'Smile'
  ];

  // Fetch available vehicles
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/available-vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const calculatePrice = async () => {
    if (!selectedVehicle || !dates.start || !dates.end) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          startDate: dates.start,
          endDate: dates.end,
          driverRequired
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

  useEffect(() => {
    calculatePrice();
  }, [selectedVehicle, dates, driverRequired]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload JPEG, PNG, or PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB.');
        return;
      }
      setDocuments({ ...documents, [type]: file });
      setError('');
    }
  };

  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to file
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `selfie_${livenessStep}.jpg`, { type: 'image/jpeg' });
          setCapturedSelfie(imageSrc);
          setDocuments({ ...documents, selfie: file });
          
          if (livenessStep < livenessInstructions.length - 1) {
            setLivenessStep(livenessStep + 1);
            setLivenessInstruction(livenessInstructions[livenessStep + 1]);
          } else {
            setSelfieMode(false);
            setLivenessInstruction('Verification complete!');
          }
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate required documents
    if (!documents.idDocument) {
      setError('Please upload a valid ID document');
      setLoading(false);
      return;
    }
    
    if (!documents.utilityBill) {
      setError('Please upload a recent NEPA bill');
      setLoading(false);
      return;
    }
    
    if (!documents.selfie) {
      setError('Please complete the liveness verification');
      setLoading(false);
      return;
    }
    
    if (driverRequired && !documents.driverLicense) {
      setError('Please upload your driver\'s license');
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('vehicleId', selectedVehicle.id);
    formData.append('startDate', dates.start);
    formData.append('endDate', dates.end);
    formData.append('driverRequired', driverRequired);
    formData.append('userId', user?.id);
    
    formData.append('idDocument', documents.idDocument);
    formData.append('utilityBill', documents.utilityBill);
    if (documents.driverLicense) formData.append('driverLicense', documents.driverLicense);
    if (documents.selfie) formData.append('selfie', documents.selfie);
    
    formData.append('driverLicenseNumber', verification.licenseNumber);
    formData.append('licenseDob', verification.licenseDob);
    formData.append('utilityAddress', verification.utilityAddress);
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://carhub-api.fly.dev/booking/create', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/payment/${data.bookingId}`, { 
            state: { 
              bookingId: data.bookingId,
              amount: priceBreakdown?.grandTotal,
              booking: data.booking
            } 
          });
        }, 2000);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Vehicle and Date Selection
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Book Your Ride</h1>
        
        {/* Vehicle Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Your Vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(vehicle => (
              <div
                key={vehicle.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedVehicle?.id === vehicle.id ? 'border-primary bg-blue-50' : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <img 
                  src={vehicle.imageUrl || '/images/car-placeholder.jpg'} 
                  alt={vehicle.title} 
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={(e) => e.target.src = '/images/car-placeholder.jpg'}
                />
                <h3 className="font-bold">{vehicle.title}</h3>
                <p className="text-gray-600 text-sm">{vehicle.description?.substring(0, 60)}...</p>
                <p className="text-primary font-semibold mt-2">₦{vehicle.dailyRate.toLocaleString()}/day</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block font-semibold mb-2">Pickup Date</label>
            <input
              type="date"
              className="w-full border rounded-lg p-3"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Return Date</label>
            <input
              type="date"
              className="w-full border rounded-lg p-3"
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
              min={dates.start}
              disabled={!dates.start}
            />
          </div>
        </div>
        
        {/* Driver Option */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={driverRequired}
              onChange={(e) => setDriverRequired(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold">I need a driver (+₦10,000/day)</span>
          </label>
        </div>
        
        {/* Price Preview */}
        {priceBreakdown && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-4">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{priceBreakdown.totalDays} days × ₦{priceBreakdown.dailyRate.toLocaleString()}</span>
                <span>₦{priceBreakdown.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (7.5%)</span>
                <span>₦{priceBreakdown.vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (0.5%)</span>
                <span>₦{priceBreakdown.tax.toLocaleString()}</span>
              </div>
              {driverRequired && (
                <div className="flex justify-between text-gray-600">
                  <span>Driver Fee (₦10,000/day)</span>
                  <span>₦{priceBreakdown.driverFee.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₦{priceBreakdown.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setStep(2)}
          disabled={!selectedVehicle || !dates.start || !dates.end}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          Continue to Verification
        </button>
      </div>
    );
  }
  
  // Step 2: Document Upload and Verification
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
      <p className="text-gray-600 mb-8">Please provide the following documents for verification</p>
      
      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-2xl font-bold text-green-600">Booking Successful!</h2>
          <p className="text-gray-600 mt-2">Redirecting to payment...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID Document Upload */}
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">
              Valid ID Document <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 ml-2">(Passport, Driver's License, National ID)</span>
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'idDocument')}
              required
              className="w-full border rounded-lg p-2"
            />
            {documents.idDocument && (
              <p className="text-green-600 text-sm mt-1">✓ {documents.idDocument.name}</p>
            )}
          </div>
          
          {/* Utility Bill Upload */}
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">
              NEPA Bill (Last 3 months) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'utilityBill')}
              required
              className="w-full border rounded-lg p-2"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a recent electricity bill for address verification</p>
            {documents.utilityBill && (
              <p className="text-green-600 text-sm mt-1">✓ {documents.utilityBill.name}</p>
            )}
          </div>
          
          {/* Utility Bill Address */}
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Address on Utility Bill <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              value={verification.utilityAddress}
              onChange={(e) => setVerification({ ...verification, utilityAddress: e.target.value })}
              placeholder="Enter the address exactly as it appears on your bill"
              required
            />
          </div>
          
          {/* Driver's License (if driver requested) */}
          {driverRequired && (
            <>
              <div className="border rounded-lg p-4">
                <label className="block font-semibold mb-2">Driver's License Upload <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'driverLicense')}
                  required
                  className="w-full border rounded-lg p-2"
                />
                {documents.driverLicense && (
                  <p className="text-green-600 text-sm mt-1">✓ {documents.driverLicense.name}</p>
                )}
              </div>
              
              <div className="border rounded-lg p-4">
                <label className="block font-semibold mb-2">Driver's License Number</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  value={verification.licenseNumber}
                  onChange={(e) => setVerification({ ...verification, licenseNumber: e.target.value })}
                  placeholder="e.g., DL-1234567890"
                />
              </div>
              
              <div className="border rounded-lg p-4">
                <label className="block font-semibold mb-2">Date of Birth (as on License)</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-3"
                  value={verification.licenseDob}
                  onChange={(e) => setVerification({ ...verification, licenseDob: e.target.value })}
                />
              </div>
            </>
          )}
          
          {/* Liveness Detection with Webcam */}
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Live Selfie Verification <span className="text-red-500">*</span></label>
            
            {!selfieMode && !capturedSelfie ? (
              <button
                type="button"
                onClick={() => setSelfieMode(true)}
                className="w-full bg-gray-100 border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50"
              >
                <div className="text-4xl mb-2">📸</div>
                <p>Click to start liveness verification</p>
                <p className="text-sm text-gray-500 mt-1">You'll be asked to perform several actions</p>
              </button>
            ) : selfieMode ? (
              <div className="text-center">
                <div className="bg-black rounded-lg overflow-hidden mb-4">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full"
                  />
                </div>
                <p className="font-semibold text-primary mb-3">{livenessInstruction}</p>
                <button
                  type="button"
                  onClick={captureSelfie}
                  className="bg-primary text-white px-6 py-2 rounded-lg"
                >
                  Capture
                </button>
                <p className="text-sm text-gray-500 mt-2">Step {livenessStep + 1} of {livenessInstructions.length}</p>
              </div>
            ) : (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl mb-2">✅</div>
                <p>Liveness verification completed!</p>
                {capturedSelfie && (
                  <img src={capturedSelfie} alt="Captured selfie" className="w-32 h-32 object-cover rounded-full mx-auto mt-3" />
                )}
              </div>
            )}
          </div>
          
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
            {loading ? 'Processing Verification...' : 'Complete Booking & Proceed to Payment'}
          </button>
        </form>
      )}
    </div>
  );
}