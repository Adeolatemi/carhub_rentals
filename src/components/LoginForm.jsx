import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show success message if redirected from signup
  const registered = location.state?.registered;

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      // Redirect based on role
      const role = user?.role || JSON.parse(localStorage.getItem("user") || "{}")?.role;
      if (role === "PARTNER") navigate("/partner/dashboard");
      else if (role === "ADMIN" || role === "SUPERADMIN") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutralLight flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-primary">Welcome Back</h1>
          <p className="font-body text-gray-400 mt-2 text-sm">Sign in to continue to CarHub</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-body mb-6">
              ✅ Account created! Please sign in.
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block font-body text-sm font-semibold text-neutralDark mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block font-body text-sm font-semibold text-neutralDark mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-900 text-white font-heading font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center font-body text-sm text-gray-500 space-y-2">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </p>
            <Link to="/" className="block text-gray-400 hover:text-gray-600">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
