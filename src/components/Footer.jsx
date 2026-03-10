 import react from "react";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/carhub_logo.jpg"
                alt="CarHub Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold">CarHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner for quality vehicle rentals. We provide the best car rental experience across major cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/fleet/1" className="text-gray-400 hover:text-white transition">Our Fleet</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Book Now</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/fleet/1" className="text-gray-400 hover:text-white transition">Car Rental</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Airport Pickup</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Corporate Rentals</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Long Term Lease</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Lagos, Nigeria</li>
              <li>📞 +234 703 168 5999</li>
              <li>✉️ carhub@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-white transition text-2xl">📘</a>
          <a href="#" className="text-gray-400 hover:text-white transition text-2xl">🐦</a>
          <a href="#" className="text-gray-400 hover:text-white transition text-2xl">📸</a>
          <a href="#" className="text-gray-400 hover:text-white transition text-2xl">💼</a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CarHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/about" className="text-gray-500 hover:text-white text-sm transition">Privacy Policy</Link>
              <Link to="/about" className="text-gray-500 hover:text-white text-sm transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

