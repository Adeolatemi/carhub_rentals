import React, { useState, useEffect } from "react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or subscribed
    const hasSeenPopup = localStorage.getItem("newsletterPopupDismissed");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // show after 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for signing up, ${email}!`);
    localStorage.setItem("newsletterPopupDismissed", "true"); // remember user
    setIsOpen(false);
    setEmail("");
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("newsletterPopupDismissed", "true"); // remember dismissal
    }
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-center text-primary">
              Subscribe to our Newsletter
            </h2>

            <p className="font-body text-lg text-gray-700 mb-6 text-center leading-relaxed">
              Get the latest updates, offers, and travel tips straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full bg-accent text-white py-3 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition"
              >
                Subscribe
              </button>
            </form>

            {/* Don't show again checkbox */}
            <div className="mt-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="dontShowAgain"
                className="font-body text-sm text-gray-600 cursor-pointer"
              >
                Don’t show this again
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}