import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireRole } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// Create an Admin user (SUPERADMIN or existing ADMIN should call this)
router.post(
  "/admins",
  authenticate,
  requireRole(["SUPERADMIN"]),
  async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Missing fields" });
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: "Email exists" });
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { email, password: hashed, name, role: "ADMIN" } });
      res.json({ id: user.id, email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Create Partner
router.post(
  "/partners",
  authenticate,
  requireRole(["SUPERADMIN", "ADMIN"]),
  async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Missing fields" });
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: "Email exists" });
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { email, password: hashed, name, role: "PARTNER" } });
      res.json({ id: user.id, email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Disable or enable a user
router.patch(
  "/users/:id/active",
  authenticate,
  requireRole(["SUPERADMIN", "ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await prisma.user.update({ where: { id }, data: { isActive } });
      res.json({ id: user.id, isActive: user.isActive });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Overview metrics
router.get("/overview", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalVehicles = await prisma.vehicle.count();
    const totalOrders = await prisma.order.count();
    const completedOrders = await prisma.order.count({ where: { status: "COMPLETED" } });
    const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
    const canceledOrders = await prisma.order.count({ where: { status: "CANCELED" } });
    const monthlyRevenueAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000) }, status: "COMPLETED" }
    });
    const monthlyRevenue = monthlyRevenueAgg._sum.totalAmount || 0;
    res.json({ totalUsers, totalVehicles, totalOrders, completedOrders, pendingOrders, canceledOrders, monthlyRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
