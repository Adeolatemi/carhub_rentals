import { useState } from "react"; 
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/fleet/1", label: "Our Fleet" },
    { path: "/about", label: "About Us" },
    { path: "/booking", label: "Booking" },
    { path: "/faqs", label: "FAQs" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="w-full z-50">

      {/* Main Header */}
      <div className="fixed top-0 w-full z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 shadow-lg backdrop-blur-sm">
        <div className="relative max-w-7xl mx-auto h-32 flex items-center px-6">
          
          {/* Logo */}
          <div className="flex items-center drop-shadow-lg">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/carhub_logo.jpg"
                alt="CarHub Logo"
                className="h-20 w-auto object-contain cursor-pointer hover:opacity-90 transition"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10 drop-shadow-md">
            {navLinks.map((link) => (
              <NavLink
                key={link.path} // ✅ unique key
                to={link.path}
                className={({ isActive }) =>
                  `relative group text-white font-medium transition duration-300 ${isActive ? "text-white" : "text-blue-100"}`
                }
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="ml-auto hidden md:flex items-center gap-4 drop-shadow-md">
            {!user ? (
              <>
                <NavLink to="/signup" className="bg-white text-blue-900 px-4 py-1.5 rounded-md font-semibold hover:bg-gray-200 transition">
                  Sign up
                </NavLink>
                <NavLink to="/login" className="text-white border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-blue-900 transition">
                  Login
                </NavLink>
              </>
            ) : (
              <button onClick={logout} className="text-white border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-blue-900 transition">
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
            className="ml-auto md:hidden text-white text-3xl drop-shadow-md"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#255B91FF] px-6 py-4 space-y-4 text-white animate-slideDown mt-32 drop-shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              {link.label}
            </NavLink>
          ))}

          {!user ? (
            <>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)} className="block font-semibold">Sign up</NavLink>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className="block">Login</NavLink>
            </>
          ) : (
            <button onClick={logout} className="block">Logout</button>
          )}

          <button onClick={toggleTheme} className="block">
            Toggle Theme
          </button>
        </div>
      )}

      {/* Scrolling Banner
      <div className="mt-32 overflow-hidden w-full bg-slate-900 py-4 group">
        <div className="inline-flex animate-[slide_20s_linear_infinite] whitespace-nowrap group-hover:pause">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i} // ✅ unique key
              className="text-white text-sm md:text-base lg:text-lg mr-16"
            >
              Enjoy a seamless car rental experience with CarHub - your trusted partner for quality vehicles and exceptional service. Book your ride today!
            </span>
          ))}
        </div>
      </div> */}

      {/* Scrolling Banner */}
<div className="mt-32 overflow-hidden w-full bg-slate-900 dark:bg-slate-800 py-4 group">
  <div className="inline-flex animate-[slide_20s_linear_infinite] whitespace-nowrap group-hover:pause">
    {Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className="banner-text">
        Enjoy a seamless car rental experience with CarHub - your trusted partner for quality vehicles and exceptional service. Book your ride today!
      </span>
    ))}
  </div>
</div>

    </header>
  );
}