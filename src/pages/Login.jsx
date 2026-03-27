// import React from "react";
// import LoginForm from "../components/LoginForm";

// export default function Login() {
//   return (
//     <main
//       className="pageContent"
//       style={{ maxWidth: 420, margin: "20px auto", padding: 20 }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           padding: 18,
//           borderRadius: 8,
//           boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
//         }}
//       >
//         <LoginForm />
//       </div>
//     </main>
//   );
// }

// src/pages/Login.jsx
import React from "react";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <main
      className="pageContent"
      style={{ maxWidth: 420, margin: "20px auto", padding: 20 }}
    >
      <div
        style={{
          background: "#fff",
          padding: 18,
          borderRadius: 8,
          boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
        }}
      >
        <LoginForm />
      </div>
    </main>
  );
}