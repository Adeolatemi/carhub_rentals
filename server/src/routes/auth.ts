import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../services/notifications";
import { authenticate, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in environment (.env)");
}

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    if (password.length < 6) return res.status(400).json({ error: "Password too short" });
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already used" });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { email, password: hashed, name, phone } 
    });
    
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.isActive) return res.status(403).json({ error: "Account disabled" });
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    
    // Return user data along with token
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: (user as any).phone,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user profile
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        kycStatus: true,
        createdAt: true,
        phone: true,
      }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
router.patch("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
      }
    });
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Password reset - request
router.post("/password-reset", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ ok: true }); // Don't reveal if email exists
    
    const resetToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "1h" });
    const resetUrl = `${process.env.FRONTEND_BASE || "http://localhost:5173"}/reset-password?token=${resetToken}`;
    await sendEmail(email, "Password reset", `Reset your password: ${resetUrl}`, `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`);
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Password reset - confirm
router.post("/password-reset/confirm", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Missing fields" });
    
    const payload: any = jwt.verify(token, JWT_SECRET);
    const userId = payload.sub;
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid token or server error" });
  }
});

export default router;
