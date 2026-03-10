// import React, { createContext, useState, useEffect } from "react";
// import API from "./api/axios";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       API.get("/auth/me")
//         .then((res) => setUser(res.data))
//         .catch(() => logout());
//     }
//   }, []);

//   const login = async (email, password) => {
//     const res = await API.post("/auth/login", { email, password });
//     localStorage.setItem("token", res.data.token);
//     setUser(res.data.user);
//   };

//   const signup = async (data) => {
//     await API.post("/auth/register", data);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, signup, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);