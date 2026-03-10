import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../api";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadVehicle();
  }, [id]);

  async function loadVehicle() {
    try {
      const data = await request(`/vehicles/${id}`);
      setVehicle(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function rent(e) {
    e.preventDefault();

    try {
      const days =
        (new Date(endDate) - new Date(startDate)) / (24 * 3600 * 1000) || 1;

      const total = (vehicle?.dailyRate || 0) * days;

      const payload = {
        vehicleId: id,
        startDate,
        endDate,
        totalAmount: total,
      };

      const order = await request(`/orders/request`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const checkout = await request(`/orders/checkout/${order.id}`, {
        method: "POST",
      });

      window.location.href = checkout.payment.paymentUrl;
    } catch (err) {
      setMsg(err.error || "Failed to create order");
    }
  }

  if (!vehicle) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>{vehicle.title}</h3>
      <p>{vehicle.description}</p>
      <p>Daily: ₦{vehicle.dailyRate}</p>

      <button onClick={() => navigate(`/booking/${vehicle.id}`)}>
        Book Now
      </button>

      <form onSubmit={rent}>
        <div>
          <label>Start</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label>End</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button type="submit">Rent</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
