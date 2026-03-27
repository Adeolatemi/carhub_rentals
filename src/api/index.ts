import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

// Routes (you will create these)
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Health Check ---
app.get("/", (_req, res) => {
  res.json({ message: "🚀 API is running" });
});

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// --- 404 Handler (VERY IMPORTANT) ---
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
});

// --- Global Error Handler ---
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("🔥 Server Error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});