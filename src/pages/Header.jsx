import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkStyle =
    "relative group text-white font-medium transition duration-300";

  return (
<header className="fixed top-0 w-full z-50 
bg-gradient-to-r 
from-slate-950 
via-slate-900 
to-blue-900 
shadow-lg backdrop-blur-sm">


    {/* <header className="w-full fixed top-0 z-50 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 backdrop-blur-sm shadow-md"> */}
      <div className="relative max-w-7xl mx-auto h-14 flex items-center px-6">

        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/carhub_logo.jpg"
              alt="CarHub Logo"
              className="h-12 w-auto object-contain cursor-pointer hover:opacity-90 transition"
            />
            <span className="text-white font-bold text-lg">CarHub</span>
          </Link>
        </div>

        {/* Desktop Nav - Centered */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10">
          {["/", "/fleet/1", "/about", "/booking"].map((path, i) => {
            const labels = ["Home", "Our Fleet", "About Us", "Booking"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `${navLinkStyle} ${isActive ? "text-white" : "text-blue-100"}`
                }
              >
                {labels[i]}

                {/* Animated underline */}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="ml-auto hidden md:flex items-center gap-4">

          {!user ? (
            <>
              <NavLink
                to="/signup"
                className="bg-white text-blue-900 px-4 py-1.5 rounded-md font-semibold hover:bg-gray-200 transition"
              >
                Sign up
              </NavLink>

              <NavLink
                to="/login"
                className="text-white border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-blue-900 transition"
              >
                Login
              </NavLink>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-white border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-blue-900 transition"
            >
              Logout
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-white border border-white px-3 py-1.5 rounded-md hover:bg-white hover:text-blue-900 transition"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto md:hidden text-white"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-#255B91FF px-6 py-4 space-y-4 text-white animate-slideDown">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink to="/fleet/1" onClick={() => setMenuOpen(false)} className="block">
            Our Fleet
          </NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)} className="block">
            About Us
          </NavLink>
          <NavLink to="/booking" onClick={() => setMenuOpen(false)} className="block">
            Booking
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)} className="block font-semibold">
                Sign up
              </NavLink>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className="block">
                Login
              </NavLink>
            </>
          ) : (
            <button onClick={logout} className="block">
              Logout
            </button>
          )}

          <button onClick={toggleTheme} className="block">
            Toggle Theme
          </button>
        </div>
      )}
  <div className="overflow-hidden w-full bg-slate-900 py-4">
  <div className="animate-[slide_10s_linear_infinite] whitespace-nowrap text-white">
   Enjoy a seamless car rental experience with Carhub - your trusted partner for quality vehicles and exceptional service. Book your ride today!
  </div>
</div>
    </header>
  );
}
