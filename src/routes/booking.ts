import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      pickupLocation,
      dropoffLocation,
      startDate,
      endDate,
      vehicleId,     // optional
      userId,        // optional (if logged in later)
    } = req.body;

    // Basic validation (keep it simple for now)
    if (!fullName || !phone || !pickupLocation || !dropoffLocation || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: compute amount (simple example)
    const totalAmount = 25000; // replace with real pricing logic later

    const booking = await prisma.carBooking.create({
      data: {
        fullName,
        phone,
        email,

        pickupLocation,
        dropoffLocation,

        startDate: new Date(startDate),
        endDate: new Date(endDate),

        totalAmount,

        // relations (optional)
        ...(userId && { userId }),
        ...(vehicleId && { vehicleId }),
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return res.status(500).json({ message: "Booking failed" });
  }
});

export default router;
