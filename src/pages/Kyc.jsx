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
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || "http://localhost:4000") + "/users/me/kyc", { method: "POST", body: fd, headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      if (!res.ok) throw data;
      setMsg("KYC uploaded — status pending");
      // reload user
      const me = await fetch((import.meta.env.VITE_API_BASE || "http://localhost:4000") + "/users/me", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const meData = await me.json();
      setUser(meData);
    } catch (err) {
      setMsg(err.error || "Upload failed");
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
