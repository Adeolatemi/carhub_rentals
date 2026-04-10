// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { auth } from "../api/index.js";

// const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
// const labelCls = "block text-sm font-semibold text-neutralDark mb-1 font-body";

// export default function Signup() {
//   const navigate = useNavigate();
//   const [isPartner, setIsPartner] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "", email: "", phone: "", password: "", confirmPassword: "",
//     company: "", cacNumber: "", fleetSize: "", address: "",
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   function handleChange(e) {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   }

//   async function submit(e) {
//     e.preventDefault();
//     setError(null);
//     if (!formData.name.trim()) return setError("Full name is required");
//     if (!formData.email.trim()) return setError("Email is required");
//     if (!formData.password) return setError("Password is required");
//     if (formData.password.length < 6) return setError("Password must be at least 6 characters");
//     if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
//     if (isPartner && !formData.company.trim()) return setError("Company name is required for partners");

//     setLoading(true);
//     try {
//       await auth.register({
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         phone: formData.phone.trim(),
//         password: formData.password,
//         ...(isPartner && {
//           role: "PARTNER",
//           company: formData.company.trim(),
//           cacNumber: formData.cacNumber.trim(),
//           fleetSize: formData.fleetSize,
//           address: formData.address.trim(),
//         }),
//       });
//       setSuccess(true);
//       setTimeout(() => navigate("/login", { state: { registered: true } }), 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-neutralLight flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-lg">

        
//         <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-sm">
//           <button
//             type="button"
//             onClick={() => setIsPartner(false)}
//             className={`flex-1 py-3 font-heading font-bold text-sm transition ${!isPartner ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
//           >
//             👤 Customer
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsPartner(true)}
//             className={`flex-1 py-3 font-heading font-bold text-sm transition ${isPartner ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
//           >
//             🚗 Fleet Partner
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-6">
//             <h1 className="font-heading text-3xl font-extrabold text-primary mb-1">
//               {isPartner ? "Partner Registration" : "Create Account"}
//             </h1>
//             <p className="font-body text-gray-400 text-sm">
//               {isPartner
//                 ? "List your fleet and earn from every booking"
//                 : "Join CarHub and book your next ride"}
//             </p>
//           </div>

//           {isPartner && (
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
//               <p className="font-body text-sm text-primary font-semibold mb-1">As a Fleet Partner you can:</p>
//               <ul className="font-body text-xs text-gray-600 space-y-1 list-disc list-inside">
//                 <li>Upload and manage your vehicles</li>
//                 <li>Monitor bookings on your fleet</li>
//                 <li>Track earnings per vehicle</li>
//               </ul>
//               <p className="font-body text-xs text-gray-400 mt-2">
//                 ⚠️ Partners cannot access admin pages, the database, or payment settings.
//               </p>
//             </div>
//           )}

//           <form onSubmit={submit} className="space-y-4">

            
//             <div>
//               <label className={labelCls}>Full Name <span className="text-accent">*</span></label>
//               <input name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="John Doe" required />
//             </div>

//             <div>
//               <label className={labelCls}>Email <span className="text-accent">*</span></label>
//               <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="john@example.com" required />
//             </div>

//             <div>
//               <label className={labelCls}>Phone</label>
//               <input name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+234 801 234 5678" />
//             </div>

            
//             {isPartner && (
//               <>
//                 <div className="border-t border-gray-100 pt-4">
//                   <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Business Details</p>

//                   <div className="space-y-4">
//                     <div>
//                       <label className={labelCls}>Company / Business Name <span className="text-accent">*</span></label>
//                       <input name="company" value={formData.company} onChange={handleChange} className={inputCls} placeholder="e.g. ABC Motors Ltd" required />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className={labelCls}>CAC Number</label>
//                         <input name="cacNumber" value={formData.cacNumber} onChange={handleChange} className={inputCls} placeholder="RC-123456" />
//                       </div>
//                       <div>
//                         <label className={labelCls}>Fleet Size</label>
//                         <select name="fleetSize" value={formData.fleetSize} onChange={handleChange} className={inputCls}>
//                           <option value="">Select</option>
//                           <option value="1-5">1 – 5 vehicles</option>
//                           <option value="6-15">6 – 15 vehicles</option>
//                           <option value="16-50">16 – 50 vehicles</option>
//                           <option value="50+">50+ vehicles</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div>
//                       <label className={labelCls}>Business Address</label>
//                       <input name="address" value={formData.address} onChange={handleChange} className={inputCls} placeholder="e.g. 12 Marina Street, Lagos" />
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             <div className="border-t border-gray-100 pt-4">
//               <div className="grid grid-cols-1 gap-4">
//                 <div>
//                   <label className={labelCls}>Password <span className="text-accent">*</span></label>
//                   <input name="password" type="password" value={formData.password} onChange={handleChange} className={inputCls} placeholder="Min. 6 characters" required />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Confirm Password <span className="text-accent">*</span></label>
//                   <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={inputCls} placeholder="••••••••" required />
//                 </div>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-body">
//                 {error}
//               </div>
//             )}

//             {success ? (
//               <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
//                 <div className="text-4xl mb-2">🎉</div>
//                 <p className="font-heading font-bold text-green-700 text-lg">Account Created!</p>
//                 <p className="font-body text-green-600 text-sm mt-1">Redirecting you to sign in...</p>
//               </div>
//             ) : (
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary hover:bg-blue-900 text-white font-heading font-bold py-3 rounded-xl transition disabled:opacity-50"
//               >
//                 {loading ? "Creating Account..." : isPartner ? "Register as Partner" : "Create Account"}
//               </button>
//             )}
//           </form>

//           <div className="mt-6 text-center text-sm font-body text-gray-500 space-y-2">
//             <Link to="/login" className="block text-primary font-semibold hover:underline">
//               Already have an account? Sign in
//             </Link>
//             <Link to="/" className="block text-gray-400 hover:text-gray-600">← Back to Home</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../api/index.js";

const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelCls = "block text-sm font-semibold text-neutralDark mb-1 font-body";

export default function Signup() {
  const navigate = useNavigate();
  const [isPartner, setIsPartner] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    company: "", cacNumber: "", fleetSize: "", address: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.name.trim()) return setError("Full name is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!formData.password) return setError("Password is required");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    if (isPartner && !formData.company.trim()) return setError("Company name is required for partners");

    setLoading(true);
    
    try {
      // Prepare registration data
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: isPartner ? "PARTNER" : "CUSTOMER",  // ✅ FIXED: role is now included
      };
      
      // Add optional fields if provided
      if (formData.phone.trim()) {
        registrationData.phone = formData.phone.trim();
      }
      
      // Add partner-specific fields
      if (isPartner) {
        registrationData.company = formData.company.trim();
        if (formData.cacNumber.trim()) registrationData.cacNumber = formData.cacNumber.trim();
        if (formData.fleetSize) registrationData.fleetSize = formData.fleetSize;
        if (formData.address.trim()) registrationData.address = formData.address.trim();
      }
      
      console.log("Sending registration data:", registrationData);
      
      const response = await auth.register(registrationData);
      console.log("Registration response:", response.data);
      
      setSuccess(true);
      setTimeout(() => navigate("/login", { state: { registered: true } }), 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutralLight flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Account type toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-sm">
          <button
            type="button"
            onClick={() => setIsPartner(false)}
            className={`flex-1 py-3 font-heading font-bold text-sm transition ${!isPartner ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            👤 Customer
          </button>
          <button
            type="button"
            onClick={() => setIsPartner(true)}
            className={`flex-1 py-3 font-heading font-bold text-sm transition ${isPartner ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            🚗 Fleet Partner
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl font-extrabold text-primary mb-1">
              {isPartner ? "Partner Registration" : "Create Account"}
            </h1>
            <p className="font-body text-gray-400 text-sm">
              {isPartner
                ? "List your fleet and earn from every booking"
                : "Join CarHub and book your next ride"}
            </p>
          </div>

          {isPartner && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="font-body text-sm text-primary font-semibold mb-1">As a Fleet Partner you can:</p>
              <ul className="font-body text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Upload and manage your vehicles</li>
                <li>Monitor bookings on your fleet</li>
                <li>Track earnings per vehicle</li>
              </ul>
              <p className="font-body text-xs text-gray-400 mt-2">
                ⚠️ Partners cannot access admin pages, the database, or payment settings.
              </p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">

            {/* Common fields */}
            <div>
              <label className={labelCls}>Full Name <span className="text-accent">*</span></label>
              <input name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="John Doe" required />
            </div>

            <div>
              <label className={labelCls}>Email <span className="text-accent">*</span></label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="john@example.com" required />
            </div>

            <div>
              <label className={labelCls}>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+234 801 234 5678" />
            </div>

            {/* Partner-only fields */}
            {isPartner && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Business Details</p>

                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Company / Business Name <span className="text-accent">*</span></label>
                      <input name="company" value={formData.company} onChange={handleChange} className={inputCls} placeholder="e.g. ABC Motors Ltd" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>CAC Number</label>
                        <input name="cacNumber" value={formData.cacNumber} onChange={handleChange} className={inputCls} placeholder="RC-123456" />
                      </div>
                      <div>
                        <label className={labelCls}>Fleet Size</label>
                        <select name="fleetSize" value={formData.fleetSize} onChange={handleChange} className={inputCls}>
                          <option value="">Select</option>
                          <option value="1-5">1 – 5 vehicles</option>
                          <option value="6-15">6 – 15 vehicles</option>
                          <option value="16-50">16 – 50 vehicles</option>
                          <option value="50+">50+ vehicles</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Business Address</label>
                      <input name="address" value={formData.address} onChange={handleChange} className={inputCls} placeholder="e.g. 12 Marina Street, Lagos" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>Password <span className="text-accent">*</span></label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} className={inputCls} placeholder="Min. 6 characters" required />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password <span className="text-accent">*</span></label>
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={inputCls} placeholder="••••••••" required />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-body">
                {error}
              </div>
            )}

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-heading font-bold text-green-700 text-lg">Account Created!</p>
                <p className="font-body text-green-600 text-sm mt-1">Redirecting you to sign in...</p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-900 text-white font-heading font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : isPartner ? "Register as Partner" : "Create Account"}
              </button>
            )}
          </form>

          <div className="mt-6 text-center text-sm font-body text-gray-500 space-y-2">
            <Link to="/login" className="block text-primary font-semibold hover:underline">
              Already have an account? Sign in
            </Link>
            <Link to="/" className="block text-gray-400 hover:text-gray-600">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}