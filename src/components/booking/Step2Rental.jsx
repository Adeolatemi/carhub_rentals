import { useState } from "react"

export default function StepTwoRental({ nextStep, prevStep }) {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    sameAsPickup: true,
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    additionalDrivers: "",
    extras: {
      childSeat: false,
      gps: false,
      babySeat: false,
      roadsideAssistance: false
    }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData({
        ...formData,
        extras: { ...formData.extras, [name]: checked }
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSameAsPickup = (e) => {
    const checked = e.target.checked
    setFormData({
      ...formData,
      sameAsPickup: checked,
      dropoffLocation: checked ? formData.pickupLocation : formData.dropoffLocation
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    nextStep(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Pickup & Drop-off Locations */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          Pickup & Drop-off Locations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location *</label>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select pickup location</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="port-harcourt">Port Harcourt</option>
              <option value=" Kano">Kano</option>
              <option value="ibadan">Ibadan</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location *</label>
            <select
              name="dropoffLocation"
              value={formData.sameAsPickup ? formData.pickupLocation : formData.dropoffLocation}
              onChange={handleChange}
              required
              disabled={formData.sameAsPickup}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select drop-off location</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="port-harcourt">Port Harcourt</option>
              <option value="kano">Kano</option>
              <option value="ibadan">Ibadan</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="sameAsPickup"
                checked={formData.sameAsPickup}
                onChange={handleSameAsPickup}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Same as pickup location</span>
            </label>
          </div>
        </div>
      </div>

      {/* Section 2: Pickup & Drop-off Dates */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
          Rental Period
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time *</label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Date *</label>
            <input
              type="date"
              name="dropoffDate"
              value={formData.dropoffDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Time *</label>
            <input
              type="time"
              name="dropoffTime"
              value={formData.dropoffTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Additional Drivers & Extras */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
          Additional Options
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Drivers</label>
            <input
              type="text"
              name="additionalDrivers"
              value={formData.additionalDrivers}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Names of additional drivers (if any)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add-on Services</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="childSeat"
                  checked={formData.extras.childSeat}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Child Seat</span>
              </label>

              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="gps"
                  checked={formData.extras.gps}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">GPS Navigation</span>
              </label>

              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="babySeat"
                  checked={formData.extras.babySeat}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Baby Seat</span>
              </label>

              <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="roadsideAssistance"
                  checked={formData.extras.roadsideAssistance}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Roadside Assistance</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/2 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Back
        </button>

        <button
          type="submit"
          className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue to Insurance
        </button>
      </div>
    </form>
  )
}
