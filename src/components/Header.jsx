import React, { useState } from "react";
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

        {/* Desktop Auth */}
        <div className="hidden md:flex flex-shrink-0 items-center space-x-3">
          {user ? (
            <>
              <span className="hidden xl:block font-bold text-white px-4 py-2 rounded-xl bg-[#1D3557]/90 text-sm">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="px-5 py-2 font-bold uppercase tracking-wide text-white bg-[#1D3557] hover:bg-black rounded-2xl transition-all duration-300 text-sm"
              >
                Logout
              </button>
            </>
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
