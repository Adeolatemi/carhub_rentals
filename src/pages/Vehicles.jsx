import React, { useEffect, useState } from "react";
import { vehicles } from "../api";
import { Link } from "react-router-dom";

export default function Vehicles() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  async function load() {
    try {
      const data = await vehicles.list({ q });
      setList(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Vehicles</h3>
      <div>
        <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={load}>Search</button>
      </div>
      <ul>
        {list.map((v) => (
          <li key={v.id}>
            <Link to={`/vehicles/${v.id}`}>{v.title} — ₦{v.dailyRate}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
