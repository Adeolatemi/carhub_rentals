import React, { useState } from "react";
import "./OurFleet.css";

const fleetData = [
  {
    id: 1,
    name: "Lexus RX 350",
    image: "/images/2021_lexus_rx-350_.avif",
    category: "Luxury",
    price: 150,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
  },
  {
    id: 2,
    name: "Toyota Alphard",
    image: "/images/alphard_w1920_02.jpg",
    category: "Luxury",
    price: 180,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 7,
  },
  {
    id: 3,
    name: "Toyota Prado",
    image: "/images/car_1.jpg",
    category: "SUV",
    price: 120,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
  },
  {
    id: 4,
    name: "Honda Civic",
    image: "/images/car_2.jpg",
    category: "Sedan",
    price: 60,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
  },
];

function OurFleet() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCar, setSelectedCar] = useState(null);
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const filteredCars =
    selectedCategory === "All"
      ? fleetData
      : fleetData.filter((car) => car.category === selectedCategory);

  const calculateDays = () => {
    if (!pickup || !returnDate) return 0;
    const start = new Date(pickup);
    const end = new Date(returnDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const total =
    selectedCar && calculateDays()
      ? calculateDays() * selectedCar.price
      : 0;

  return (
    <div className="fleet-container">
      <h1 className="fleet-title">Our Fleet</h1>

      {/* Filters */}
      <div className="filters">
        {["All", "SUV", "Sedan", "Luxury"].map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Car Grid */}
      <div className="fleet-grid">
        {filteredCars.map((car) => (
          <div className="fleet-card" key={car.id}>
            <img src={car.image} alt={car.name} />
            <h3>{car.name}</h3>
            <p className="price">${car.price} / day</p>
            <button
              className="book-btn"
              onClick={() => {
                setSelectedCar(car);
                setPickup("");
                setReturnDate("");
              }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCar && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedCar(null)}>
              ×
            </span>

            <img src={selectedCar.image} alt={selectedCar.name} />
            <h2>{selectedCar.name}</h2>
            <p>Category: {selectedCar.category}</p>
            <p>Transmission: {selectedCar.transmission}</p>
            <p>Fuel: {selectedCar.fuel}</p>
            <p>Seats: {selectedCar.seats}</p>
            <p className="price">${selectedCar.price} / day</p>

            <div className="booking-form">
              <label>Pickup Date</label>
              <input
                type="date"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />

              <label>Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />

              <div className="total">
                Total: <strong>${total}</strong>
              </div>

              <button className="confirm-btn">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OurFleet;