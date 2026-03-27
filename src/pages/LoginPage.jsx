// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login, getUser } from "../api"; // centralized API functions

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       // Use centralized login function
//       const data = await login(email, password);

//       // Save token and user info
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // Optionally fetch current user after login
//       const user = await getUser();
//       console.log("Logged in user:", user);

//       navigate("/dashboard"); // redirect after successful login
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Login failed. Please check your credentials.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{ display: "flex", flexDirection: "column", gap: 10 }}
//     >
//       <h2>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

// src/components/LoginForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUser, logout } from "../api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // logged-in user state
  const navigate = useNavigate();

  // Load user from localStorage if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      navigate("/dashboard"); // redirect after login
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  // If user is logged in, show greeting + logout button
  if (user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2>Hi, {user.name || user.email}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // If not logged in, show login form
  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}