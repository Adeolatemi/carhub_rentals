import React, { useEffect, useState } from "react";
import { request } from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  async function load() {
    try {
      const [userData, orders] = await Promise.all([
        request(`/users/me`),
        request('/orders/my-orders')
      ]);
      setProfile({ ...userData, orders });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, []);

  if (!profile) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h3>Profile</h3>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>KYC status: {profile.kycStatus || 'Not submitted'}</p>
      <a href="/kyc">Upload KYC</a>
      <h4>Rental history</h4>
      <ul>
        {(profile.orders || []).map(o => (
          <li key={o.id}>{o.vehicleId} — {o.status} — ₦{o.totalAmount}</li>
        ))}
      </ul>
    </div>
  );
}
