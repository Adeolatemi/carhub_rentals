import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

// FAQ data
const faqSections = [
  {
    title: "Booking & Reservations",
    items: [
      { q: "How do I book a ride with Carhub Rental?", a: "You can book online via our website or contact our customer service to reserve your car." },
      { q: "How far in advance should I book?", a: "We recommend booking at least 24 hours in advance for best availability." },
      { q: "Can I modify or cancel my booking?", a: "Yes, bookings can be modified or canceled according to our terms and conditions." },
      { q: "Do you provide instant booking confirmation?", a: "Yes, you will receive instant confirmation via email or SMS." },
    ],
  },
  {
    title: "Pricing & Payment",
    items: [
      { q: "How is pricing calculated?", a: "Pricing is based on distance, vehicle type, and rental duration." },
      { q: "What payment methods do you accept?", a: "We accept credit/debit cards, bank transfers, and cash payments in some cases." },
      { q: "Are there additional charges for waiting time?", a: "Yes, waiting time is charged as per our policy." },
      { q: "Do you offer corporate rates?", a: "Yes, we provide special rates for corporate clients. Contact us for details." },
    ],
  },
  {
    title: "Service Details",
    items: [
      { q: "Are your drivers professional and licensed?", a: "Yes, all our drivers are fully licensed and trained for customer service." },
      { q: "What areas do you serve?", a: "We serve Lagos, Abuja, and surrounding areas." },
      { q: "Are your vehicles insured?", a: "Yes, all vehicles come with comprehensive insurance coverage." },
      { q: "Do you provide child car seats?", a: "Yes, upon request, we can provide child safety seats." },
    ],
  },
  {
    title: "Special Services",
    items: [
      { q: "Do you provide airport meet and greet service?", a: "Yes, we provide personalized airport pickup and drop services." },
      { q: "Can you handle group transportation for events?", a: "Absolutely, we offer group transportation for weddings, parties, and corporate events." },
      { q: "Do you provide wedding car decoration?", a: "Yes, wedding car decoration can be arranged upon request." },
      { q: "Are you available 24/7?", a: "Yes, our services are available round the clock." },
    ],
  },
  {
    title: "Safety & Policies",
    items: [
      { q: "What safety measures do you have in place?", a: "All vehicles are sanitized, and drivers follow strict safety protocols." },
      { q: "What is your policy on smoking and alcohol?", a: "Smoking and alcohol consumption are strictly prohibited in our vehicles." },
      { q: "Can I track my ride?", a: "Yes, our system allows real-time tracking for your booked ride." },
      { q: "What happens in case of vehicle breakdown?", a: "We provide immediate assistance and vehicle replacement if needed." },
    ],
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (sectionIdx, itemIdx) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex justify-center px-4 py-12">
      <SEO
        title="FAQs — Car Rental Questions Answered | CarHub Lagos"
        description="Frequently asked questions about CarHub car rental in Lagos. Booking, pricing, payment, safety, airport transfers, wedding cars and more."
        path="/faqs"
      />
      <div className="max-w-4xl w-full space-y-12">

        {/* Header Section
        <div className="flex flex-col items-center text-center px-4 md:px-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white px-8 py-4 rounded-lg bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 shadow-lg">
            Car Rentals & FAQs
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-100 max-w-3xl">
            Find answers to common questions about our car hiring service
          </p>
          <p className="mt-2 text-gray-200 max-w-3xl">
            How can we help you? Browse through our FAQ sections or contact us if you don’t see what you need.
          </p>
          <div className="mt-6 w-16 h-16 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-3xl font-bold opacity-40">
            ?
          </div> */}

<div className="flex flex-col items-center text-center px-4 md:px-12 -mt-16"> {/* Lifted up using -mt-16 */}
  {/* Gradient background container for both heading and subheading */}
  <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 px-8 py-6 rounded-lg shadow-lg w-full max-w-4xl">
    <h1 className="text-4xl md:text-5xl font-bold text-white">
      Car Rentals & FAQs
    </h1>
    <p className="mt-3 text-lg md:text-xl text-gray-100">
      Find answers to common questions about our car hiring service. How can we help you? Browse through our FAQ sections or contact us if you don’t see what you need.
    </p>
  </div>

  {/* Question mark in faint circular background below the text */}
  <div className="mt-6 w-16 h-16 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-3xl font-bold opacity-40">
    ?
  </div>
 </div>

        {/* FAQ Sections */}
        {faqSections.map((section, sectionIdx) => (
          <div key={section.title} className="bg-white dark:bg-slate-800 shadow-lg rounded-lg px-6 py-8">
            <h2 className="text-3xl font-semibold mb-6 text-center border-b border-gray-300 dark:border-gray-600 pb-3">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, itemIdx) => {
                const key = `${sectionIdx}-${itemIdx}`;
                const isOpen = openIndex === key;
                return (
                  <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggle(sectionIdx, itemIdx)}
                      className="w-full text-left px-5 py-4 text-lg font-semibold flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >
                      {item.q}
                      <svg
                        className={`w-6 h-6 ml-3 transform transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-blue-500" : "rotate-0 text-gray-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
                      <p className="px-6 py-4 text-base text-gray-700 dark:text-gray-300">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div className="text-center bg-blue-600 dark:bg-blue-700 text-white rounded-lg p-8">
          <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
          <p className="mb-3 text-lg">Can’t find the answer? Our friendly support team can help!</p>
          <p className="mb-2">Call Us: <a href="tel:+2347031685999" className="underline">+234 703 168 5999</a></p>
          <p className="mb-2">WhatsApp Us: <a href="https://wa.me/2347031685999" target="_blank" rel="noopener noreferrer" className="underline">Chat on WhatsApp</a></p>
          <p className="mb-2">Contact Form: <Link to="/contact" className="underline">Contact Us</Link></p>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-8">
          <Link to="/booking" className="bg-blue-600 dark:bg-blue-700 text-white font-semibold px-10 py-4 rounded-lg shadow hover:bg-blue-500 transition">
            Book Online Now
          </Link>
          <Link to="/fleet/1" className="bg-green-600 dark:bg-green-700 text-white font-semibold px-10 py-4 rounded-lg shadow hover:bg-green-500 transition">
            View Our Fleet
          </Link>
        </div>

      </div>
    </div>
  );
}