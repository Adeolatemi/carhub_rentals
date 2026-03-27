import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/index.js";

export default function BookingConfirm() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!orderId) { setStatus("error"); return; }
    api.get(`/orders/${orderId}`)
      .then(({ data }) => setStatus(data.status === "CONFIRMED" ? "confirmed" : "pending"))
      .catch(() => setStatus("error"));
  }, [orderId]);

  const states = {
    loading: { icon: "⏳", title: "Verifying payment...", color: "text-gray-500", bg: "bg-gray-50" },
    confirmed: { icon: "✅", title: "Booking Confirmed!", color: "text-green-600", bg: "bg-green-50" },
    pending:   { icon: "🕐", title: "Payment Pending", color: "text-yellow-600", bg: "bg-yellow-50" },
    error:     { icon: "❌", title: "Something went wrong", color: "text-red-600", bg: "bg-red-50" },
  };

  const s = states[status];

  return (
    <div className="min-h-screen bg-neutralLight flex items-center justify-center px-4">
      <div className={`${s.bg} rounded-2xl shadow-lg p-10 max-w-md w-full text-center`}>
        <div className="text-6xl mb-4">{s.icon}</div>
        <h1 className={`font-heading text-2xl font-extrabold ${s.color} mb-3`}>{s.title}</h1>

        {status === "confirmed" && (
          <p className="font-body text-gray-500 mb-6">
            Your ride is booked! We'll be in touch with confirmation details shortly.
          </p>
        )}
        {status === "pending" && (
          <p className="font-body text-gray-500 mb-6">
            Your payment is being processed. We'll confirm your booking once it clears.
          </p>
        )}
        {status === "error" && (
          <p className="font-body text-gray-500 mb-6">
            We couldn't verify your booking. Please contact support if payment was deducted.
          </p>
        )}

        {orderId && status !== "loading" && (
          <p className="font-body text-xs text-gray-400 mb-6">
            Booking ref: <span className="font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Link to="/dashboard" className="bg-primary text-white font-heading font-bold py-3 rounded-xl hover:bg-blue-900 transition">
            Go to Dashboard
          </Link>
          <Link to="/booking" className="border border-primary text-primary font-heading font-bold py-3 rounded-xl hover:bg-blue-50 transition">
            Book Another Ride
          </Link>
        </div>
      </div>
    </div>
  );
}
