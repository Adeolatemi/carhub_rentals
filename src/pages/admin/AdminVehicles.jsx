import React, { useEffect, useState } from "react";
import { request, admin } from "../../api";

export default function AdminVehicles() {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [dailyRate, setDailyRate] = useState(0);

  async function load() {
    try { const data = await request(`/vehicles`); setList(data); } catch (e) { console.error(e); }
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await admin.createVehicle({ title, description: "", dailyRate });
    setTitle(""); setDailyRate(0);
    load();
  }

  async function delist(id) { await admin.delistVehicle(id); load(); }

  return (
    <div>
      <h2>Vehicles</h2>
      <form onSubmit={create}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Daily rate" type="number" value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value))} />
        <button type="submit">Create</button>
      </form>
      <ul>
        {list.map(v => (
          <li key={v.id}>{v.title} — ₦{v.dailyRate} {v.available ? "" : "(delisted)"} <button onClick={() => delist(v.id)}>Delist</button></li>
        ))}
      </ul>
    </div>
  );
}
