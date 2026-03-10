import React, { useEffect, useState } from "react";
import { request } from "../../api";

export default function PartnerVehicles() {
  const [list, setList] = useState([]);
  useEffect(() => { request('/vehicles').then(setList).catch(console.error); }, []);
  return (
    <div>
      <h3>Your Vehicles</h3>
      <ul>
        {list.map(v => <li key={v.id}>{v.title} — ₦{v.dailyRate}</li>)}
      </ul>
    </div>
  );
}
