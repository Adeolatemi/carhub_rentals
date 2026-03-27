
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({\n  origin: "http://localhost:5173",\n  credentials: true\n})); 
// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"; // ✅ add your users routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "carhub-server" });
});

// ✅ Catch-all 404 handler (for unknown routes)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler (must come after routes)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

