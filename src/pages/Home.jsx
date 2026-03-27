import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImagePath } from "../utils/getImagePath";

const Home = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: '',
    carType: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/booking', { state: formData });
  };
  return (
    <div className="font-body text-neutralDark">

      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center"

        style={{
          backgroundImage: `url(${getImagePath("vintage_car.jpg")})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
            Premium Car Hire Service in Lagos
          </h1>

          <p className="text-2xl md:text-3xl mb-8">
            Comfort, Style, and Reliability 24/7
          </p>

          <div className="flex gap-4">
            <Link to="/booking" className="bg-accent px-8 py-4 rounded-lg hover:bg-yellow-600 inline-block">
              Book Now
            </Link>

            <button className="bg-white text-primary px-8 py-4 rounded-lg">
              WhatsApp Us
            </button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-white shadow-lg rounded-lg p-10 max-w-4xl mx-auto -mt-16 relative z-10">
        <h2 className="text-4xl font-bold mb-8 text-center text-primary">
          Book Your Ride
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >
<input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="border p-4 rounded" />
<input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="border p-4 rounded" />
<input name="pickup" placeholder="Pickup Location" value={formData.pickup} onChange={handleChange} className="border p-4 rounded" />
<input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} className="border p-4 rounded" />

          <select name="carType" value={formData.carType} onChange={handleChange} className="border p-4 rounded">
            <option value="">Select Car Type</option>
            <option>Saloon</option>
            <option>SUV</option>
            <option>Luxury Sedan</option>
            <option>Bus</option>
          </select>

          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-4 rounded" />
          <input type="time" name="time" value={formData.time} onChange={handleChange} className="border p-4 rounded" />

          <button className="col-span-2 bg-primary text-white py-4 rounded-lg">
            Book My Ride Now
          </button>
        </form>
      </section>

      {/* Fleet */}
      <section className="py-20 bg-neutralLight">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
          Our Fleet
        </h2>

        <div className="flex gap-6 overflow-x-auto px-6 pb-4 scrollbar-hide">
          {[
            { id: 1, name: "Toyota Highlander", image: "toyota_highlander.jpg" },
            { id: 2, name: "Toyota Prado", image: "toyota_prado.jpg" },
            { id: 3, name: "Toyota Van", image: "toyota_van.jpg" },
            { id: 4, name: "Toyota HD", image: "hd_toyota.jpg" },
          ].map((car) => (
            <div
              key={car.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform flex-shrink-0 w-72"
            >
              <img
                src={getImagePath(car.image)}
                alt={car.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="font-heading text-xl font-semibold mb-2">{car.name}</h3>
                <p className="font-body text-gray-500 text-sm mb-4">From ₦25,000/day</p>
                <Link
                  to="/booking"
                  className="block text-center bg-accent text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-body text-sm font-semibold transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/fleet"
            className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold px-8 py-3 rounded-xl hover:bg-blue-900 transition shadow-lg"
          >
            More Fleet <span className="text-accent text-lg">→</span>
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center px-6">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-primary">
              About CarHub Rentals
            </h2>

            <p className="text-xl text-gray-700 mb-6">
              Reliable, affordable, and stylish car hire services across Lagos.
            </p>

            <Link
              to="/about"
              className="bg-accent text-white px-6 py-3 rounded-lg"
            >
              Learn More
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div>100+ Clients</div>
            <div>5★ Service</div>
            <div>24/7</div>
            <div>2 Cities</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-neutralLight">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          {[
            { id: 1, icon: "⏰", title: "24/7 Availability", desc: "Always available." },
            { id: 2, icon: "👨‍✈️", title: "Professional Chauffeurs", desc: "Experienced drivers." },
            { id: 3, icon: "🚘", title: "Premium Fleet", desc: "Top vehicles." },
            { id: 4, icon: "⏱️", title: "Punctual Service", desc: "Always on time." },
            { id: 5, icon: "💰", title: "Affordable Rates", desc: "No hidden fees." },
            { id: 6, icon: "⭐", title: "Top Reviews", desc: "Trusted service." },
          ].map((f) => (
            <div key={f.id} className="flex items-start gap-6">
              <span className="text-4xl">{f.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-primary">
                  {f.title}
                </h3>
                <p className="text-gray-700">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-blue-50">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
          What Our Customers Say
        </h2>

        <div className="flex gap-8 overflow-x-auto px-6">
          {[
            {
              id: 1,
              stars: "★★★★★",
              quote: "Excellent service and clean cars.",
              name: "Adebayo Johnson",
            },
            {
              id: 2,
              stars: "★★★★★",
              quote: "Perfect for my wedding.",
              name: "Sarah Okafor",
            },
            {
              id: 3,
              stars: "★★★★★",
              quote: "Always reliable airport rides.",
              name: "Michael Adebayo",
            },
          ].map((t) => (
            <div key={t.id} className="bg-white p-6 rounded shadow min-w-[80%]">
              <p className="text-yellow-500">{t.stars}</p>
              <p className="italic my-4">"{t.quote}"</p>
              <p className="font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Book Your Ride?
        </h2>

        <button className="bg-accent px-8 py-4 rounded-lg">
          Reserve Now
        </button>
      </section>
    </div>
  );
};

export default Home;
