import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/auth/verify-email", { email, code });
      setMessage("Email verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post("/auth/resend-verification", { email });
      setMessage("New verification code sent!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutralLight flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-primary mb-2">Verify Your Email</h2>
        <p className="text-center text-gray-500 mb-6">
          Please enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4 text-center text-2xl tracking-widest"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={handleResend} className="text-primary hover:underline text-sm">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}