// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// export default function Dashboard() {
//   const { user } = useAuth();
//   useEffect(() => {
//     // Check if we just came from booking
//     const justBooked = localStorage.getItem("just_booked");
//     if (justBooked === "true") {
//       localStorage.removeItem("just_booked");
//       return;
//     }
//     console.log("Dashboard loaded, user:", user?.email);
//   }, [user]);

//   return (
//     <div className="min-h-screen bg-neutralLight flex items-center justify-center px-4">
//       <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
//         <p className="font-body text-sm uppercase tracking-widest text-accent font-semibold mb-2">
//           Hi, {user?.name} 👋
//         </p>
//         <h1 className="font-heading text-4xl font-extrabold text-primary mb-3">
//           Welcome back!
//         </h1>
//         <p className="font-body text-gray-500 text-lg mb-8">
//           You can now book a ride.{" "}
//           <Link
//             to="/booking"
//             className="text-accent font-semibold underline underline-offset-4 hover:text-yellow-600 transition-colors duration-200"
//           >
//             Book here.
//           </Link>
//         </p>
//         <div className="h-1 w-16 bg-accent rounded-full mx-auto" />
//       </div>
//     </div>
//   );
// }

import React from 'react';

export default function Dashboard() {
  // Remove all hooks and complex logic
  console.log("Simple dashboard mounted");
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '32px', color: '#2563eb', marginBottom: '16px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '18px', color: '#333', marginBottom: '24px' }}>
          You have successfully booked a ride!
        </p>
        <a 
          href="/booking"
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          Book Another Ride
        </a>
      </div>
    </div>
  );
}