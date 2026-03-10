import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import healthRouter from "./routes/health";
import authRoutes from "./routes/auth";
import adminRouter from "./routes/admin";
import vehiclesRouter from "./routes/vehicles";
import ordersRouter from "./routes/orders";
import usersRouter from "./routes/users";
import path from "path";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Parse multipart/form-data for file uploads
import multer from "multer";
app.use(multer().any());

// Routes
app.use("/health", healthRouter);
app.use("/auth", authRoutes);
app.use("/admin", adminRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Root endpoint
app.get("/", (req, res) => res.json({ ok: true, service: "carhub-server" }));
