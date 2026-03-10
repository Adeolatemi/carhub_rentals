
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth as authApi } from '../api'

export default function Signup(){
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function submit(e){
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name.trim()) return setError('Name is required')
    if (!formData.email.trim()) return setError('Email is required')
    if (!formData.password) return setError('Password is required')
    if (formData.password.length < 6) return setError('Password must be at least 6 characters')
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match')

    setLoading(true)
    try{
      const payload = { 
        name: formData.name.trim(), 
        email: formData.email.trim(), 
        phone: formData.phone.trim() || undefined, 
        password: formData.password 
      }
      console.log('Registering with:', payload)
      await authApi.register(payload)
      alert('Registration successful! Please login.')
      navigate('/login')
    }catch(err){
      console.error('Registration error:', err)
      setError(err?.error || err?.message || 'Registration failed. Please try again.')
    }finally{ 
      setLoading(false) 
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join CarHub and start renting today</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                name="name"
                placeholder="Your full name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                name="email"
                type="email"
                placeholder="your@email.com" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
              <input 
                name="phone"
                type="tel"
                placeholder="+234 800 000 0000" 
                value={formData.phone} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                name="password"
                type="password"
                placeholder="At least 6 characters" 
                value={formData.password} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password" 
                value={formData.confirmPassword} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

