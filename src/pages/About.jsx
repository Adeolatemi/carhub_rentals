import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About CarHub Hiring Service
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Main About Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            CarHub is a modern car hiring platform connecting customers with trusted vehicle partners.
            We provide flexible, transparent rental options across major cities, from economy cars
            to premium vehicles, with flexible booking periods and clear pricing.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 md:p-12 mb-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center uppercase tracking-wider">
            Our Mission
          </h2>
          <div className="w-16 h-1 bg-white/50 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto text-blue-100">
            Our mission is to make vehicle hiring effortless — whether you need a car for a day,
            a week, or longer. We focus on safety, maintenance, and excellent customer support.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: '01', title: 'Create Account', desc: 'Create an account and complete KYC verification if required.' },
              { num: '02', title: 'Browse Fleet', desc: 'Browse our fleet and select the vehicle and dates you want.' },
              { num: '03', title: 'Reserve & Pay', desc: 'Reserve and pay securely through our payment partners.' },
              { num: '04', title: 'Enjoy Your Trip', desc: 'Pick up or get the car delivered and enjoy your journey.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="text-3xl font-bold text-blue-600">{item.num}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px bg-gray-300 w-24"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <div className="h-px bg-gray-300 w-24"></div>
        </div>

        {/* Safety & Maintenance */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Safety & Maintenance
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔧', title: 'Regular Maintenance', desc: 'All vehicles go through regular maintenance checks' },
              { icon: '✅', title: 'Verified Partners', desc: 'Vehicles are verified by our trusted partner garages' },
              { icon: '📞', title: '24/7 Support', desc: 'Report any issues and we will address them immediately' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-300 mb-6">
            For partnerships or support, feel free to reach out to us
          </p>
          <a 
            href="mailto:support@carhub.example" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>

      </div>
    </div>
  )
}
