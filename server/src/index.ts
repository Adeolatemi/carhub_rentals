import dotenv from "dotenv";
dotenv.config();

import app from "./app"; // import the configured app (with routes/middleware)

import path from "path";
import express from "express";

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down...");
  process.exit(0);
});