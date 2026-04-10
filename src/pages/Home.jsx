import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImagePath } from "../utils/getImagePath";
import SEO from "../components/SEO";

const fleet = [
  { id: 1, name: "Toyota Highlander", image: "toyota_highlander.jpg", rate: "35,000" },
  { id: 2, name: "Toyota Prado", image: "toyota_prado.jpg", rate: "40,000" },
  { id: 3, name: "Toyota Van", image: "toyota_van.jpg", rate: "30,000" },
  { id: 4, name: "Toyota HD", image: "hd_toyota.jpg", rate: "25,000" },
];

const features = [
  { icon: "⏰", title: "24/7 Availability", desc: "Round-the-clock service, any day of the year." },
  { icon: "👨‍✈️", title: "Professional Chauffeurs", desc: "Trained, vetted, and experienced drivers." },
  { icon: "🚘", title: "Premium Fleet", desc: "Well-maintained, modern vehicles." },
  { icon: "⏱️", title: "Punctual Service", desc: "We value your time — always on schedule." },
  { icon: "💰", title: "Affordable Rates", desc: "Transparent pricing, no hidden charges." },
  { icon: "⭐", title: "5-Star Reviews", desc: "Trusted by hundreds of satisfied customers." },
];

const testimonials = [
  { id: 1, quote: "Excellent service and spotless cars. Highly recommend CarHub for airport transfers.", name: "Adebayo Johnson", role: "Business Executive" },
  { id: 2, quote: "They made our wedding day perfect. The car was stunning and the driver was professional.", name: "Sarah Okafor", role: "Bride" },
  { id: 3, quote: "My go-to for reliable airport rides in Lagos. Never been late once.", name: "Michael Adebayo", role: "Frequent Traveller" },
];

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", phone: "", pickup: "", destination: "", carType: "", date: "", time: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); navigate("/booking", { state: formData }); };

  return (
    <div className="font-body text-neutralDark">
      <SEO
        title="Car Rental Lagos Nigeria | Book a Ride Today"
        description="Premium car rental in Lagos. Book a saloon, SUV, luxury sedan or bus with or without a driver. Airport transfers, weddings, corporate events. Easy online booking."
        path="/"
      />

      {/* ── Hero ── */}
      <section
        aria-label="Hero — Car Rental Lagos"
        className="relative w-full min-h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${getImagePath("vintage_car.jpg")})` }}
      >
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="relative z-10 w-full text-center text-white px-4 py-20">
          <p className="font-body text-accent uppercase tracking-widest text-sm font-semibold mb-4">Lagos, Nigeria</p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Premium Car Hire<br className="hidden sm:block" /> Service in Lagos
          </h1>
          <p className="font-body text-lg sm:text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
            Comfort, Style, and Reliability — 24/7 across Lagos and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-accent text-white font-heading font-bold px-8 py-4 rounded-xl hover:bg-yellow-600 transition text-lg"
              aria-label="Book a car now"
            >
              Book Now
            </Link>
            <a
              href="https://wa.me/2347031685999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary font-heading font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg"
              aria-label="Chat with us on WhatsApp"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Quick Booking Form ── */}
      <section aria-label="Quick booking form" className="bg-white shadow-xl rounded-2xl p-6 md:p-10 max-w-4xl mx-auto -mt-12 relative z-10 mx-4 md:mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
          Book Your Ride
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Full name" />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Phone number" />
          <input name="pickup" placeholder="Pickup Location" value={formData.pickup} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Pickup location" />
          <input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Destination" />
          <select name="carType" value={formData.carType} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Car type">
            <option value="">Select Car Type</option>
            <option>Saloon</option>
            <option>SUV</option>
            <option>Luxury Sedan</option>
            <option>Bus</option>
          </select>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg font-body w-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Pickup date" />
          <button type="submit" className="sm:col-span-2 bg-primary text-white font-heading font-bold py-4 rounded-xl hover:bg-blue-900 transition text-lg">
            Book My Ride Now
          </button>
        </form>
      </section>

      {/* ── Fleet ── */}
      <section aria-label="Our fleet" className="py-20 bg-neutralLight overflow-hidden">
        <div className="text-center mb-10 px-4">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">Our Fleet</h2>
          <p className="font-body text-gray-500 max-w-xl mx-auto">Choose from our range of well-maintained vehicles for any occasion.</p>
        </div>

        <div className="flex gap-4 overflow-x-auto w-full px-4 pb-4 scrollbar-hide">
          {fleet.map((car) => (
            <article
              key={car.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform flex-shrink-0 w-[80vw] sm:w-72 md:w-[calc(25%-12px)]"
            >
              <img
                src={getImagePath(car.image)}
                alt={`${car.name} for hire in Lagos`}
                className="w-full h-48 object-cover"
                loading="lazy"
                width="288"
                height="192"
              />
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold mb-1">{car.name}</h3>
                <p className="font-body text-gray-500 text-sm mb-4">From ₦{car.rate}/day</p>
                <Link to="/booking" className="block text-center bg-accent text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-body text-sm font-semibold transition">
                  Book Now
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8 px-4">
          <Link to="/fleet" className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold px-8 py-3 rounded-xl hover:bg-blue-900 transition shadow-lg">
            View Full Fleet <span className="text-accent">→</span>
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section aria-label="Company stats" className="py-16 bg-primary text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "5★", label: "Average Rating" },
            { value: "24/7", label: "Availability" },
            { value: "2", label: "Cities Covered" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-heading text-4xl font-extrabold text-accent">{s.value}</p>
              <p className="font-body text-white/80 mt-1 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section aria-label="About CarHub" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
          <div>
            <p className="font-body text-accent uppercase tracking-widest text-xs font-semibold mb-3">Who We Are</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-5 text-primary">
              Lagos's Most Trusted Car Rental Service
            </h2>
            <p className="font-body text-gray-600 mb-4 leading-relaxed">
              CarHub Rentals provides reliable, affordable, and stylish car hire services across Lagos and Abuja. Whether you need an airport transfer, a wedding car, or a corporate vehicle, we've got you covered.
            </p>
            <p className="font-body text-gray-600 mb-6 leading-relaxed">
              We also offer a partner programme for fleet owners — list your vehicles, earn from every booking, and grow your business with us.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="bg-primary text-white font-heading font-bold px-6 py-3 rounded-xl hover:bg-blue-900 transition">
                Learn More
              </Link>
              <Link to="/signup" className="border-2 border-primary text-primary font-heading font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition">
                Become a Partner
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={getImagePath("toyota_highlander.jpg")} alt="Toyota Highlander rental Lagos" className="rounded-2xl w-full h-48 object-cover" loading="lazy" />
            <img src={getImagePath("toyota_prado.jpg")} alt="Toyota Prado hire Lagos" className="rounded-2xl w-full h-48 object-cover mt-6" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section aria-label="Why choose CarHub" className="py-20 bg-neutralLight">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">Why Choose CarHub?</h2>
            <p className="font-body text-gray-500 max-w-xl mx-auto">We go beyond just renting cars — we deliver an experience.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-start gap-4">
                <span className="text-3xl flex-shrink-0" aria-hidden="true">{f.icon}</span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-1">{f.title}</h3>
                  <p className="font-body text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section aria-label="Customer testimonials" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">What Our Customers Say</h2>
            <p className="font-body text-gray-500">Real reviews from real customers across Lagos.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-accent text-xl mb-3" aria-label="5 stars">★★★★★</p>
                <p className="font-body text-gray-700 italic mb-4">"{t.quote}"</p>
                <footer>
                  <p className="font-heading font-bold text-primary text-sm">{t.name}</p>
                  <p className="font-body text-gray-400 text-xs">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section aria-label="Call to action" className="bg-primary text-white py-20 text-center px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">Ready to Book Your Ride?</h2>
        <p className="font-body text-white/80 mb-8 max-w-lg mx-auto">Join hundreds of satisfied customers. Book online in minutes.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/booking" className="bg-accent text-white font-heading font-bold px-8 py-4 rounded-xl hover:bg-yellow-600 transition text-lg">
            Reserve Now
          </Link>
          <Link to="/fleet" className="bg-white text-primary font-heading font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg">
            Browse Fleet
          </Link>
        </div>
      </section>

    </div>
  );
}
