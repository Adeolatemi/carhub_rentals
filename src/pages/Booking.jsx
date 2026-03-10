// import { useState } from "react";
// import Step1Identity from "../components/booking/Step1Identity";
// import Step2Rental from "../components/booking/Step2Rental";
// import Step3Insurance from "../components/booking/Step3Insurance";

// export default function BookingPage() {
//   const [step, setStep] = useState(1);

//   const next = () => setStep(step + 1);
//   const back = () => setStep(step - 1);

//   return (
//     <div className="min-h-screen bg-slate-950 text-white pt-24 px-6">
//       <div className="max-w-3xl mx-auto bg-slate-900 p-8 rounded-lg shadow-lg">

//         <h1 className="text-2xl font-bold mb-6">
//           Car Rental Booking
//         </h1>

//         {step === 1 && <Step1Identity next={next} />}
//         {step === 2 && <Step2Rental next={next} back={back} />}
//         {step === 3 && <Step3Insurance back={back} />}

//       </div>
//     </div>
//   );
// }
import { useState } from "react"
import StepOneIdentity from "../components/booking/Step1Identity"
import StepTwoRental from "../components/booking/Step2Rental"
import StepThreePayment from "../components/booking/Step3Insurance"
import BookingProgress from "../components/BookingProgress"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Booking() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({})
  const [requireAuth, setRequireAuth] = useState(false)

  // Check if user needs to login before final submission
  const checkAuthAndProceed = () => {
    if (!user) {
      setRequireAuth(true)
      return false
    }
    return true
  }

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate("/login")
  }

  // Handle signup redirect
  const handleSignupRedirect = () => {
    navigate("/signup")
  }

  // Clear auth requirement and proceed
  const clearAuthRequirement = () => {
    setRequireAuth(false)
  }

  const nextStep = (data) => {
    setBookingData({...bookingData, ...data})
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  // Show auth requirement modal if user needs to login
  if (requireAuth) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-6">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to complete your booking. This helps us maintain a record of our users and provide better service.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={handleSignupRedirect}
              className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Sign Up
            </button>
            <button
              onClick={clearAuthRequirement}
              className="w-full text-gray-500 py-2 hover:text-gray-700 transition"
            >
              Continue as Guest (Booking will be saved)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <BookingProgress step={step} />

        {step === 1 && <StepOneIdentity nextStep={nextStep} />}

        {step === 2 && (
          <StepTwoRental 
            nextStep={nextStep} 
            prevStep={prevStep}
          />
        )}

        {step === 3 && (
          <StepThreePayment 
            bookingData={bookingData}
            prevStep={prevStep}
            checkAuth={checkAuthAndProceed}
          />
        )}
      </div>
    </div>
  )
}
