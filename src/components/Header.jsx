import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { getImagePath } from "../utils/getImagePath";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/fleet", label: "Fleet" },
  { to: "/booking", label: "Book" },
  { to: "/about", label: "About" },
  { to: "/faqs", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const linkCls = (active) =>
  `font-bold text-base tracking-wide py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/20 hover:text-[#F4D35E] ${
    active ? "bg-white/30 text-[#F4D35E]" : "text-white"
  }`;

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if user has admin role
  const isAdmin = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-20 shadow-2xl border-b border-gray-200" role="banner">
      <div className="w-full h-full bg-gradient-to-r from-[#0A2342] via-[#1D3557] to-[#F4D35E] flex items-center px-4 md:px-8">

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" aria-label="CarHub Home">
            <img
              src={getImagePath("carhub_logo.png")}
              alt="CarHub car rental Lagos"
              className="h-12 w-auto hover:opacity-90 transition-opacity"
              width="120"
              height="48"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="flex-1 hidden md:flex justify-center space-x-1 lg:space-x-2" aria-label="Main navigation">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={linkCls(isActive(to))}>{label}</Link>
          ))}
        </nav>

        {/* Desktop Auth - Avatar Dropdown */}
        <div className="hidden md:flex flex-shrink-0 items-center space-x-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-[#1D3557]/90 hover:bg-[#1D3557] px-4 py-2 rounded-full transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-[#F4D35E] text-[#0A2342] flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-white text-sm font-medium hidden lg:block">
                  {user.name?.split(" ")[0]}
                </span>
                <svg className={`w-4 h-4 text-white transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">
                      {user.role}
                    </span>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>

                  {/* Admin Portal - Only visible to admins */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 transition border-t"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Portal
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition border-t"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="font-bold uppercase tracking-wide text-white hover:text-[#F4D35E] px-5 py-2 bg-[#1D3557]/90 hover:bg-[#1D3557] rounded-xl transition-all duration-300 text-sm">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2 font-bold uppercase tracking-wide text-[#0A2342] bg-white hover:bg-[#E5E5E5] rounded-2xl transition-all duration-300 border-2 border-[#0A2342] text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="text-white p-2 rounded-lg hover:bg-white/20 transition"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A2342] border-t border-white/10 px-4 py-4 space-y-1" role="navigation" aria-label="Mobile navigation">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 px-4 rounded-xl font-bold text-sm transition ${
                isActive(to) ? "bg-white/20 text-[#F4D35E]" : "text-white hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {user ? (
              <>
                <p className="text-white/60 text-xs px-4">Hi, {user.name}</p>
                {/* Mobile Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl font-bold text-sm text-purple-300 hover:bg-white/10 transition"
                  >
                    🔧 Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full text-left py-3 px-4 rounded-xl font-bold text-sm text-white hover:bg-white/10 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 px-4 rounded-xl font-bold text-sm text-white hover:bg-white/10 transition">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-3 px-4 rounded-xl font-bold text-sm text-[#0A2342] bg-white hover:bg-gray-100 transition text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}