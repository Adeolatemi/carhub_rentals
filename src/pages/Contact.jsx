// src/pages/Contact.jsx
import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Send to your backend API
      const response = await fetch('https://carhub-api.fly.dev/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again or call us directly.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact CarHub - Car Rental Lagos | Get in Touch"
        description="Contact CarHub Rentals in Lagos. Book a car, ask questions, or get support. Call +234 703 168 5999 or email info@carhubrental.com"
        path="/contact"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact CarHub</h1>
            <p className="text-xl max-w-2xl mx-auto">Get in touch for car hire bookings, inquiries, or questions about our car rental services in Lagos</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-primary text-2xl">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Our Location</h3>
                    <p className="text-gray-600">1b Shobowale Street<br />Off Keke Akilo Road Agege<br />Lagos, Nigeria</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-primary text-2xl">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Phone Number</h3>
                    <a href="tel:+2347031685999" className="text-gray-600 hover:text-primary transition">+234 703 168 5999</a>
                    <p className="text-sm text-gray-500 mt-1">Available 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-primary text-2xl">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Email Address</h3>
                    <a href="mailto:info@carhubrental.com" className="text-gray-600 hover:text-primary transition">info@carhubrental.com</a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-primary text-2xl">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Operating Hours</h3>
                    <p className="text-gray-600">24 hours a day<br />7 days a week<br />365 days a year</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com/carhub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com/carhub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition">
                    <FaTwitter />
                  </a>
                  <a href="https://instagram.com/carhub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition">
                    <FaInstagram />
                  </a>
                  <a href="https://wa.me/2347031685999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition">
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>
                <p className="text-gray-600 mb-6">Fill out the form below and we'll respond as soon as possible</p>
                
                {status.message && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+234 703 168 5999"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Booking Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Tell us about your car rental needs..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Google Maps Embed (Optional) */}
          <div className="mt-16">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.8765!2d3.3089!3d6.6142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9b8d8e8e8e8e%3A0x8e8e8e8e8e8e8e8e!2sAgege%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CarHub Location Map"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Book Your Car Hire in Lagos Today</h2>
            <p className="text-xl mb-8">Don't wait — book your car rental in Lagos today and discover why CarHub is the most trusted car hire service in Nigeria.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/booking" className="inline-block bg-accent text-primary font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition">Book Now</a>
              <a href="tel:+2347031685999" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition">Call Us Now</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}