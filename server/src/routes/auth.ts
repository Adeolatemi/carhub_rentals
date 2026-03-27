// src/routes/auth.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

import { prisma } from "../prismaClient";
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in .env");
}

// ---------------------------
// Register user
// ---------------------------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role, company, cacNumber, fleetSize, address } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const userRole = role === "PARTNER" ? "PARTNER" : "CUSTOMER";

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: userRole, isActive: true },
    });

    if (userRole === "PARTNER" && company) {
      await prisma.partnerDetails.create({
        data: {
          userId: user.id,
          company,
          phone: phone || null,
          cacNumber: cacNumber || null,
          fleetSize: fleetSize || null,
          address: address || null,
        },
      });
    }

    res.status(201).json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------------
// Login user
// ---------------------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.isActive) return res.status(403).json({ error: "Account disabled" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // Optionally set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------------
// Logout user
// ---------------------------
router.post("/logout", (_req, res) => {
  try {
    res.clearCookie("token");
    res.json({ ok: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------------
// Get current logged-in user
// ---------------------------
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ ok: true, user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;