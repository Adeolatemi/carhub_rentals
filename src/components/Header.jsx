import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-screen z-50 h-20 shadow-2xl border-b border-gray-200">
      <div className="w-screen h-full bg-gradient-to-r from-[#0A2342] via-[#1D3557] to-[#F4D35E] flex items-center">
        <div className="flex-shrink-0 px-6 md:px-12 lg:px-16">
          <img 
            src="/images/carhub_logo.png" 
            alt="CarHub" 
            className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/')}
          />
        </div>
        
        {/* Centered Nav */}
        <nav className="flex-1 hidden md:flex justify-center space-x-4 lg:space-x-6 xl:space-x-8">
          <a 
            href="/" 
            className={`font-bold text-base lg:text-lg tracking-wide py-4 px-4 lg:px-6 rounded-xl hover:bg-white/20 hover:text-[#F4D35E] hover:shadow-xl transition-all duration-300 ${location.pathname === '/' ? 'bg-white/30 text-[#F4D35E] shadow-xl' : ''}`}
          >
            Home
          </a>
          <a 
            href="/fleet" 
            className={`font-bold text-base lg:text-lg tracking-wide py-4 px-4 lg:px-6 rounded-xl hover:bg-white/20 hover:text-[#F4D35E] hover:shadow-xl transition-all duration-300 ${location.pathname === '/fleet' || location.pathname === '/vehicles' ? 'bg-white/30 text-[#F4D35E] shadow-xl' : ''}`}
          >
            Fleet
          </a>
          <a 
            href="/booking" 
            className={`font-bold text-base lg:text-lg tracking-wide py-4 px-4 lg:px-6 rounded-xl hover:bg-white/20 hover:text-[#F4D35E] hover:shadow-xl transition-all duration-300 ${location.pathname.includes('/booking') ? 'bg-white/30 text-[#F4D35E] shadow-xl' : ''}`}
          >
            Book
          </a>
          <a 
            href="/about" 
            className={`font-bold text-base lg:text-lg tracking-wide py-4 px-4 lg:px-6 rounded-xl hover:bg-white/20 hover:text-[#F4D35E] hover:shadow-xl transition-all duration-300 ${location.pathname === '/about' ? 'bg-white/30 text-[#F4D35E] shadow-xl' : ''}`}
          >
            About
          </a>
          <a 
            href="/faqs" 
            className={`font-bold text-base lg:text-lg tracking-wide py-4 px-4 lg:px-6 rounded-xl hover:bg-white/20 hover:text-[#F4D35E] hover:shadow-xl transition-all duration-300 ${location.pathname === '/faqs' ? 'bg-white/30 text-[#F4D35E] shadow-xl' : ''}`}
          >
            FAQ
          </a>
          <a 
            href="/contact" 
            className={`font-bold text-base lg:text-lg tracking-wide py-4 px-4 lg:px-6 rounded-xl hover:bg-white/20 hover:text-[#F4D35E] hover:shadow-xl transition-all duration-300 ${location.pathname === '/contact' ? 'bg-white/30 text-[#F4D35E] shadow-xl' : ''}`}
          >
            Contact
          </a>
        </nav>
        
        <div className="flex-shrink-0 px-6 md:px-12 lg:px-16 flex items-center space-x-3 lg:space-x-4">
          {user ? (
            <>
              <span className="hidden xl:block font-bold text-white shadow-lg px-4 py-2 rounded-xl bg-[#1D3557]/90">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-6 py-3 font-bold uppercase tracking-wide text-white bg-[#1D3557] hover:bg-black rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a 
                href="/login" 
                className="font-bold uppercase tracking-wide text-white hover:text-[#F4D35E] hidden 2xl:block px-5 py-2 bg-[#1D3557]/90 hover:bg-[#1D3557] rounded-xl transition-all duration-300 shadow-lg"
              >
                Login
              </a>
              <a 
                href="/signup" 
                className="px-8 py-3 font-bold uppercase tracking-wide text-[#0A2342] bg-white hover:bg-[#E5E5E5] rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-[#0A2342]"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
