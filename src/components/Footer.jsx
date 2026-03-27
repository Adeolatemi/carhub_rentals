import React from "react";
import { Link } from "react-router-dom";
import { getImagePath } from "../utils/getImagePath";
import { useAuth } from "../contexts/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid layout: stacks on mobile, 4 columns on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={getImagePath("carhub_logo.png")}
                alt="CarHub Logo"
                className="h-12 w-auto"
              />
              <span className="font-heading text-2xl font-bold">CarHub</span>
            </div>
            <p className="font-body text-lg text-gray-400 leading-relaxed">
              Your trusted partner for quality vehicle rentals. We provide the
              best car rental experience across major cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 font-body text-lg">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/fleet/1" className="text-gray-400 hover:text-white transition">Our Fleet</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Book Now</Link></li>
              {user && (
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link></li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-6">Services</h3>
            <ul className="space-y-3 font-body text-lg">
              <li><Link to="/fleet/1" className="text-gray-400 hover:text-white transition">Car Rental</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Airport Pickup</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Corporate Rentals</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white transition">Long Term Lease</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3 font-body text-lg text-gray-400">
              <li>📍 Lagos, Nigeria</li>
              <li>📞 +234 703 168 5999</li>
              <li>✉️ carhub@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a href="#" className="text-gray-400 hover:text-white transition text-3xl">📘</a>
          <a href="#" className="text-gray-400 hover:text-white transition text-3xl">🐦</a>
          <a href="#" className="text-gray-400 hover:text-white transition text-3xl">📸</a>
          <a href="#" className="text-gray-400 hover:text-white transition text-3xl">💼</a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-body text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} CarHub. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-8 font-body text-sm">
              <Link to="/about" className="text-gray-500 hover:text-white transition">Privacy Policy</Link>
              <Link to="/about" className="text-gray-500 hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}