import React from "react";
import SEO from "../components/SEO";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <SEO
        title="About Us — CarHub Car Rental Lagos"
        description="Learn about CarHub Rentals — Lagos's most trusted car hire service. Our mission, how it works, safety standards, and fleet partner programme."
        path="/about"
      />
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            About CarHub Hiring Service
          </h1>
          <div className="w-28 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Main About Content */}
        <div className="bg-white rounded-2xl shadow-lg p-10 md:p-14 mb-12">
          <p className="font-body text-xl md:text-2xl text-gray-800 leading-relaxed text-center max-w-4xl mx-auto">
            CarHub is a modern car hiring platform connecting customers with trusted vehicle partners.
            We provide flexible, transparent rental options across major cities, from economy cars
            to premium vehicles, with flexible booking periods and clear pricing.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl shadow-lg p-10 md:p-14 mb-12 text-white">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-center uppercase tracking-wide">
            Our Mission
          </h2>
          <div className="w-20 h-1 bg-white/50 mx-auto mb-8 rounded-full"></div>
          <p className="font-body text-xl md:text-2xl leading-relaxed text-center max-w-4xl mx-auto text-blue-100">
            Our mission is to make vehicle hiring effortless — whether you need a car for a day,
            a week, or longer. We focus on safety, maintenance, and excellent customer support.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-10 md:p-14 mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { num: "01", title: "Create Account", desc: "Create an account and complete KYC verification if required." },
              { num: "02", title: "Browse Fleet", desc: "Browse our fleet and select the vehicle and dates you want." },
              { num: "03", title: "Reserve & Pay", desc: "Reserve and pay securely through our payment partners." },
              { num: "04", title: "Enjoy Your Trip", desc: "Pick up or get the car delivered and enjoy your journey." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-6 bg-gray-50 rounded-xl">
                <span className="font-heading text-4xl font-bold text-primary">{item.num}</span>
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-lg text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="h-px bg-gray-300 w-28"></div>
          <div className="w-4 h-4 bg-primary rounded-full"></div>
          <div className="h-px bg-gray-300 w-28"></div>
        </div>

        {/* Safety & Maintenance */}
        <div className="bg-white rounded-2xl shadow-lg p-10 md:p-14 mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center">
            Safety & Maintenance
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🔧", title: "Regular Maintenance", desc: "All vehicles go through regular maintenance checks." },
              { icon: "✅", title: "Verified Partners", desc: "Vehicles are verified by our trusted partner garages." },
              { icon: "📞", title: "24/7 Support", desc: "Report any issues and we will address them immediately." },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 bg-blue-50 rounded-xl">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-lg text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-10 md:p-14 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h2>
          <p className="font-body text-xl text-gray-300 mb-8">
            For partnerships or support, feel free to reach out to us
          </p>
          <a
            href="mailto:support@carhub.example"
            className="inline-block bg-primary text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}