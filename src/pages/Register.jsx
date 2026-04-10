// import React, { useState } from "react";
// import { auth } from "../api/index.js";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [msg, setMsg] = useState("");

//   async function submit(e) {
//     e.preventDefault();
//     try {
//       await auth.register({ email, password, name });
//       setMsg("Registered. Please login.");
//     } catch (err) {
//       setMsg(err.error || "Registration failed");
//     }
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h3>Register</h3>
//       <form onSubmit={submit}>
//         <div>
//           <label>Name</label>
//           <input value={name} onChange={(e) => setName(e.target.value)} />
//         </div>
//         <div>
//           <label>Email</label>
//           <input value={email} onChange={(e) => setEmail(e.target.value)} />
//         </div>
//         <div>
//           <label>Password</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </div>
//         <button type="submit">Register</button>
//       </form>
//       {msg && <p>{msg}</p>}
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/index.js";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    
    try {
      // ✅ FIXED: Include role field
      const response = await auth.register({ 
        email, 
        password, 
        name,
        role: "CUSTOMER"
      });
      console.log("Registration response:", response.data);
      setMsg("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setMsg(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 10 }}>
          <label>Name</label><br />
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password</label><br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: 5,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {msg && <p style={{ marginTop: 10, color: msg.includes("success") ? "green" : "red" }}>{msg}</p>}
    </div>
  );
}