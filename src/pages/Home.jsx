import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SLIDE_IMAGES = [
  '/images/back_drop.jpg',
  '/images/background_image.jpg'
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Slideshow */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {SLIDE_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDE_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
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

      {/* Why Choose CarHub Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Why Choose CarHub?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We offer the best car rental deals for your travel needs
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚗',
                title: 'Wide Selection',
                desc: 'Choose from economy to luxury vehicles'
              },
              {
                icon: '💰',
                title: 'Best Prices',
                desc: 'Competitive rates with no hidden fees'
              },
              {
                icon: '⭐',
                title: 'Top Rated Service',
                desc: 'Trusted by thousands of customers'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Popular Rental Locations
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Find a car rental near you
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            {['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'].map((city, idx) => (
              <Link
                key={idx}
                to="/fleet/1"
                className="block bg-gray-100 hover:bg-blue-50 rounded-lg p-6 text-center transition group"
              >
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                  {city}
                </h3>
                <p className="text-sm text-gray-500">View available cars</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Car?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of satisfied customers who trust CarHub for their car rental needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Reserve Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Vehicles' },
              { number: '10,000+', label: 'Happy Customers' },
              { number: '5+', label: 'Years Experience' },
              { number: '10+', label: 'Locations' }
            ].map((stat, idx) => (
              <div key={idx} className="text-white">
                <div 
                  className="text-4xl md:text-5xl font-bold text-blue-400 mb-2"
                  style={{
                    animation: `refresh 2s ease-in-out infinite`,
                    display: 'inline-block'
                  }}
                >
                  {stat.number}
                </div>
                <div className="text-lg text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes refresh {
          0% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
