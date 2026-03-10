import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function StepThreePayment({ bookingData, prevStep, checkAuth }) {
  const navigate = useNavigate()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedLiability, setAcceptedLiability] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [receipt, setReceipt] = useState(null)

  // Generate receipt number
  const generateReceiptNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `CARHUB-${timestamp}-${random}`
  }

  // Generate receipt data
  const generateReceipt = () => {
    const receiptNumber = generateReceiptNumber()
    const today = new Date()
    
    return {
      receiptNumber,
      bookingDate: today.toLocaleDateString(),
      bookingTime: today.toLocaleTimeString(),
      customer: {
        name: bookingData.fullName || "Customer",
        email: bookingData.email || "customer@email.com",
        phone: bookingData.phoneNumber || "N/A"
      },
      rental: {
        pickupLocation: bookingData.pickupLocation || "N/A",
        dropoffLocation: bookingData.dropoffLocation || bookingData.pickupLocation || "N/A",
        pickupDate: bookingData.pickupDate || "N/A",
        pickupTime: bookingData.pickupTime || "N/A",
        dropoffDate: bookingData.dropoffDate || "N/A",
        dropoffTime: bookingData.dropoffTime || "N/A"
      },
      extras: bookingData.extras || {},
      status: "CONFIRMED",
      paymentStatus: "PENDING"
    }
  }

  // Simulate sending email with receipt
  const sendReceiptEmail = async (receiptData) => {
    // In a real application, this would call your backend API
    // Example: await API.post('/bookings/send-receipt', receiptData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log("Receipt sent to:", receiptData.customer.email)
    console.log("Receipt Details:", receiptData)
    
    // Return true to indicate successful "sending"
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!acceptedTerms || !acceptedLiability) {
      alert("Please accept all terms and conditions to proceed.")
      return
    }

    // Check if user is authenticated before proceeding
    if (checkAuth && !checkAuth()) {
      return // User will be redirected to login
    }

    setIsSubmitting(true)
    
    try {
      // Generate receipt
      const receiptData = generateReceipt()
      
      // Send receipt via email
      await sendReceiptEmail(receiptData)
      
      // Set receipt data for display
      setReceipt(receiptData)
      setSubmitted(true)
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Failed to submit booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted && receipt) {
    return (
      <div className="text-center py-6">
        {/* Success Icon */}
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Submitted Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your booking. A receipt has been generated and sent to your email.
        </p>

        {/* Receipt Display */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-left max-w-md mx-auto mb-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">CarHub Rental</h3>
              <p className="text-sm text-gray-500">Car Rental Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Receipt No.</p>
              <p className="font-mono text-sm font-bold text-blue-600">{receipt.receiptNumber}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium">{receipt.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time:</span>
              <span className="font-medium">{receipt.bookingTime}</span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <p className="text-gray-500 mb-1">Customer Details</p>
              <p className="font-medium">{receipt.customer.name}</p>
              <p className="text-xs text-gray-500">{receipt.customer.email}</p>
              <p className="text-xs text-gray-500">{receipt.customer.phone}</p>
            </div>

            <div className="border-t pt-3 mt-3">
              <p className="text-gray-500 mb-1">Rental Details</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-gray-500">Pickup:</span>
                <span className="font-medium capitalize">{receipt.rental.pickupLocation}</span>
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{receipt.rental.pickupDate}</span>
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">{receipt.rental.pickupTime}</span>
                <span className="text-gray-500">Drop-off:</span>
                <span className="font-medium capitalize">{receipt.rental.dropoffLocation}</span>
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{receipt.rental.dropoffDate}</span>
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  {receipt.status}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t mt-4 pt-4 text-center">
            <p className="text-xs text-gray-500">
              A copy of this receipt has been sent to {receipt.customer.email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Print Receipt
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Insurance Information */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          Insurance & Coverage
        </h2>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-2">Included Coverage</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
            <li>Basic collision damage waiver (CDW)</li>
            <li>Third party liability insurance</li>
            <li>Fire and theft protection</li>
            <li>24/7 customer support</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Damage Excess</h3>
          <p className="text-sm text-gray-700">
            The renter is responsible for damages up to <strong>₦150,000</strong> unless additional coverage is purchased.
            This amount will be held as a security deposit and refunded upon safe return of the vehicle.
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
          Terms & Conditions
        </h2>
        
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-3 max-h-60 overflow-y-auto">
          <p><strong>Cancellation Policy:</strong></p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Free cancellation up to 48 hours before pickup</li>
            <li>50% fee for cancellations within 24-48 hours</li>
            <li>No refund for cancellations within 24 hours</li>
          </ul>
          
          <p><strong>Vehicle Use:</strong></p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Vehicle must be returned in the same condition</li>
            <li>Fuel policy: Return with same fuel level</li>
            <li>No smoking in the vehicle</li>
            <li>Only registered drivers permitted</li>
          </ul>
          
          <p><strong>Prohibited Use:</strong></p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Driving under the influence of alcohol or drugs</li>
            <li>Reckless or dangerous driving</li>
            <li>Off-road driving</li>
            <li>Using vehicle for commercial purposes</li>
          </ul>
        </div>

        <label className="block mt-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the <a href="#" className="text-blue-600 underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 underline">Cancellation Policy</a>. *
            </span>
          </div>
        </label>
      </div>

      {/* Liability Acceptance */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
          Liability Agreement
        </h2>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-gray-700 mb-3">
            By renting this vehicle, I agree to:
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Comply with all traffic regulations and laws</li>
            <li>Accept full liability for damages caused by negligence</li>
            <li>Accept liability for damages caused by reckless driving</li>
            <li>Accept liability for damages while driving under the influence</li>
            <li>Accept liability for any unauthorized drivers</li>
            <li>Pay for any damages, fines, or penalties incurred</li>
          </ul>
        </div>

        <label className="block mt-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={acceptedLiability}
              onChange={(e) => setAcceptedLiability(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="text-sm text-gray-700">
              I understand and accept full liability for the vehicle during the rental period and agree to the terms stated above. *
            </span>
          </div>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/2 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          disabled={isSubmitting}
        >
          Back
        </button>

        <button
          type="submit"
          disabled={!acceptedTerms || !acceptedLiability || isSubmitting}
          className="w-1/2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Confirm & Generate Receipt"}
        </button>
      </div>
    </form>
  )
}
