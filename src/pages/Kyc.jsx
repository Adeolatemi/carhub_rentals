import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Kyc() {
  const { user, setUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

async function submit(e) {
    e.preventDefault();
    if (!file) { setMsg("Please select a file"); return; }
    const fd = new FormData();
    fd.append("document", file);
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_API_BASE || "/api"; // Use proxy /api -> server
    try {
      const res = await fetch(baseUrl + "/users/me/kyc", { 
        method: "POST", 
        body: fd, 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      
      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text.substring(0, 200)}`);
      }
      
      if (!res.ok) throw data;
      
      setMsg("KYC uploaded — status pending");
      // reload user
      const meRes = await fetch(baseUrl + "/users/me", { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      
      let meData;
      try {
        meData = await meRes.json();
      } catch {
        throw new Error("Failed to fetch updated user profile");
      }
      setUser(meData);
    } catch (err) {
      console.error("KYC upload error:", err);
      setMsg(err.message || err.error || "Upload failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>KYC Upload</h3>
      <p>Current status: {user?.kycStatus || "Not submitted"}</p>
      <form onSubmit={submit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
