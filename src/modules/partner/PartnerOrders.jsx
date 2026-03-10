import React, { useEffect, useState } from "react";
import { request, admin } from "../../api";

export default function PartnerOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { request('/orders').then(setOrders).catch(console.error); }, []);

  async function confirm(id) {
    try {
      await admin.updateOrderStatus(id, { status: 'CONFIRMED' });
      setOrders((s) => s.map(o => o.id === id ? { ...o, status: 'CONFIRMED' } : o));
    } catch (e) { console.error(e); }
  }

  return (
    <div>
      <h3>Partner Orders</h3>
      <ul>
        {orders.map(o => (
          <li key={o.id}>{o.id} — {o.status} <button onClick={() => confirm(o.id)}>Confirm</button></li>
        ))}
      </ul>
    </div>
  );
}
