import React, { useState, useEffect } from "react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("newsletterPopupDismissed");
    const hasSubscribed = localStorage.getItem("newsletterSubscribed");
    
    if (!hasSeenPopup && !hasSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    if (!email.includes("@") || !email.includes(".")) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Optional: Send to your backend
      // const response = await fetch("https://server-icy-grass-4740.fly.dev/newsletter/subscribe", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      
      // For now, just store locally
      setMessage({ type: "success", text: "Thanks for subscribing! 🎉" });
      localStorage.setItem("newsletterSubscribed", "true");
      
      setTimeout(() => {
        setIsOpen(false);
        setEmail("");
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("newsletterPopupDismissed", "true");
    }
    setIsOpen(false);
    setEmail("");
    setMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition"
          aria-label="Close"
        >
          ×
        </button>

        <div className="text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-primary">
            Subscribe to our Newsletter
          </h2>
          <p className="font-body text-gray-600 mb-6 leading-relaxed">
            Get the latest updates, exclusive offers, and travel tips straight to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
          
          {message && (
            <div className={`text-center text-sm font-body p-2 rounded-lg ${
              message.type === "success" 
                ? "bg-green-50 text-green-600" 
                : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-3 rounded-xl font-heading font-semibold text-base hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
          />
          <label
            htmlFor="dontShowAgain"
            className="font-body text-xs text-gray-500 cursor-pointer hover:text-gray-700"
          >
            Don't show this again
          </label>
        </div>
      </div>
    </div>
  );
}