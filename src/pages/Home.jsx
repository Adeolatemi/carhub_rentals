import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// const SLIDE_IMAGES = [
//   "/images/back_drop.jpg",
//   "/images/background_image.jpg"
const SLIDE_IMAGES = [
  `${import.meta.env.BASE_URL}images/back_drop.jpg`,
  `${import.meta.env.BASE_URL}images/background_image.jpg`

];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">

      {/* HERO SLIDESHOW */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">

        {SLIDE_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        {/* SLIDE INDICATORS */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDE_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* HERO TEXT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              CarHub Car Rental
            </h1>

            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Rent a car for your next adventure
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link
                to="/fleet/1"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
              >
                Browse Fleet
              </Link>

              <Link
                to="/booking"
                className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
              >
                Book Now
              </Link>

            </div>

          </div>
        </div>
      </div>


      {/* WHY CHOOSE US */}
      <section className="bg-gray-50 py-16 px-4">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose CarHub?
          </h2>

          <p className="text-center text-gray-600 mb-12">
            We offer the best car rental deals for your travel needs
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            <Feature icon="🚗" title="Wide Selection" desc="Choose from economy to luxury vehicles" />
            <Feature icon="💰" title="Best Prices" desc="Competitive rates with no hidden fees" />
            <Feature icon="⭐" title="Top Rated Service" desc="Trusted by thousands of customers" />

          </div>

        </div>

      </section>


      {/* LOCATIONS */}
      <section className="bg-white py-16 px-4">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Popular Rental Locations
          </h2>

          <p className="text-center text-gray-600 mb-12">
            Find a car rental near you
          </p>

          <div className="grid md:grid-cols-4 gap-4">

            {["Lagos", "Abuja", "Port Harcourt", "Ibadan"].map((city, idx) => (
              <Link
                key={idx}
                to="/fleet/1"
                className="block bg-gray-100 hover:bg-blue-50 rounded-lg p-6 text-center transition"
              >
                <h3 className="text-lg font-semibold">{city}</h3>
                <p className="text-sm text-gray-500">View available cars</p>
              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-blue-600 py-16 px-4">

        <div className="max-w-4xl mx-auto text-center text-white">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Car?
          </h2>

          <p className="text-blue-100 mb-8">
            Join thousands of satisfied customers who trust CarHub
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              to="/booking"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Reserve Now
            </Link>

            <Link
              to="/about"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Learn More
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
