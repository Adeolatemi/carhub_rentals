// src/components/PartnerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { partner } from "../api";

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  // Fetch subscription when user is a partner
  useEffect(() => {
    if (user?.role === "PARTNER") {
      partner
        .subscription()
        .then(setSubscription)
        .catch((err) => console.error("Failed to load subscription:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle subscription action
  const handleSubscribe = async (plan) => {
    setSubLoading(true);
    try {
      const res = await partner.subscribe(plan);
      window.location.href = res.paymentUrl; // redirect to payment gateway
    } catch (err) {
      alert(err.error || "Subscription failed");
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const isTrial = subscription?.status === "TRIAL";
  const isActive = subscription?.status === "ACTIVE";

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Partner Dashboard
      </h1>

      {/* Subscription status card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Subscription Status
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {subscription?.status || "No subscription"}
          </p>
          <p className="text-sm text-gray-600">{subscription?.plan} Plan</p>
          {subscription?.endDate && (
            <p className="text-sm text-gray-500">
              Expires: {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Subscription activation section */}
      {!isActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">
            Activate Your Subscription
          </h3>
          <p className="text-gray-700 mb-6">
            List your fleet for rental after subscribing.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe("BASIC")}
              disabled={subLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              Basic - ₦5,000/mo (5 vehicles)
            </button>
            <button
              onClick={() => handleSubscribe("PRO")}
              disabled={subLoading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              Pro - ₦15,000/mo (Unlimited)
            </button>
          </div>
          {isTrial && (
            <p className="text-sm text-yellow-800 mt-4">
              Trial active — upgrade anytime!
            </p>
          )}
        </div>
      )}

      {/* Quick stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-2xl text-blue-600">0</div>
            <div className="text-gray-600">Active Rentals</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-green-600">
              {isActive ? "Unlimited" : "5"}
            </div>
            <div className="text-gray-600">Vehicle Limit</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-purple-600">0</div>
            <div className="text-gray-600">Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
}