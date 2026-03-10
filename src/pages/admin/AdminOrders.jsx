import React, { useEffect, useState } from "react";
import { request, admin } from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  async function load() {
    try { const data = await request(`/orders`); setOrders(data); } catch (e) { console.error(e); }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await admin.updateOrderStatus(id, { status });
    load();
  }

  return (
    <div>
      <h2>Orders</h2>
      <table>
        <thead><tr><th>ID</th><th>User</th><th>Vehicle</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>{o.vehicleId}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => updateStatus(o.id, "CONFIRMED")}>Confirm</button>
                <button onClick={() => updateStatus(o.id, "COMPLETED")}>Complete</button>
                <button onClick={() => updateStatus(o.id, "CANCELED")}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
