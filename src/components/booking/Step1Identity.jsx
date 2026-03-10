import { useState } from "react"

export default function StepOneIdentity({ nextStep }) {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    residentialAddress: "",
    countryOfResidence: "",
    driversLicenseNumber: "",
    licenseIssuingCountry: "",
    licenseExpiryDate: "",
    licenseFront: null,
    licenseBack: null,
    selfie: null,
    passport: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData({ ...formData, [name]: files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    nextStep(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Personal Bio-Data */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Legal Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full legal name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
            <input
              type="text"
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full residential address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence *</label>
            <input
              type="text"
              name="countryOfResidence"
              value={formData.countryOfResidence}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nigeria"
            />
          </div>
        </div>
      </div>

      {/* Section 2: License Information */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
          Driver's License Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver's License Number *</label>
            <input
              type="text"
              name="driversLicenseNumber"
              value={formData.driversLicenseNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your license number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Issuing Country *</label>
            <input
              type="text"
              name="licenseIssuingCountry"
              value={formData.licenseIssuingCountry}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nigeria"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date *</label>
            <input
              type="date"
              name="licenseExpiryDate"
              value={formData.licenseExpiryDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Document Uploads */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
          Document Uploads
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver's License (Front) *</label>
            <input
              type="file"
              name="licenseFront"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver's License (Back) *</label>
            <input
              type="file"
              name="licenseBack"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selfie Verification *</label>
            <input
              type="file"
              name="selfie"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Take a clear selfie for identity verification</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport (for international renters)</label>
            <input
              type="file"
              name="passport"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Continue to Rental Details
      </button>
    </form>
  )
}
