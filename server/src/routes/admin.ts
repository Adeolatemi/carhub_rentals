// src/routes/admin.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import { authenticate, requireRole } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// --------------------
// Helper function
// --------------------
const handleError = (res: Response, err: unknown, message = "Server error") => {
  console.error(err);
  return res.status(500).json({ error: message });
};

// --------------------
// Create Admin user
// --------------------
router.post(
  "/admins",
  authenticate,
  requireRole(["SUPERADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existing: User | null = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, role: "ADMIN" },
      });

      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      handleError(res, err);
    }
  }
);

// --------------------
// Create Partner user
// --------------------
router.post(
  "/partners",
  authenticate,
  requireRole(["SUPERADMIN", "ADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existing: User | null = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, role: "PARTNER" },
      });

      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      handleError(res, err);
    }
  }
);

// --------------------
// Enable / Disable User
// --------------------
router.patch(
  "/users/:id/active",
  authenticate,
  requireRole(["SUPERADMIN", "ADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "isActive must be boolean" });
      }

      const user = await prisma.user.update({
        where: { id },
        data: { isActive },
      });

      res.json({ id: user.id, isActive: user.isActive });
    } catch (err) {
      handleError(res, err);
    }
  }
);

// --------------------
// Overview metrics
// --------------------
router.get(
  "/overview",
  authenticate,
  requireRole(["SUPERADMIN", "ADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const totalUsers = await prisma.user.count();
      const totalVehicles = await prisma.vehicle.count();
      const totalOrders = await prisma.order.count();
      const completedOrders = await prisma.order.count({ where: { status: "COMPLETED" } });
      const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
      const canceledOrders = await prisma.order.count({ where: { status: "CANCELED" } });

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const monthlyRevenueAgg = await prisma.order.aggregate({
        _sum: { total: true }, // <-- make sure your schema has 'total' column
        where: { createdAt: { gte: thirtyDaysAgo }, status: "COMPLETED" },
      });

      const monthlyRevenue = monthlyRevenueAgg._sum.total || 0;

      res.json({
        totalUsers,
        totalVehicles,
        totalOrders,
        completedOrders,
        pendingOrders,
        canceledOrders,
        monthlyRevenue,
      });
    } catch (err) {
      handleError(res, err);
    }
  }
);

export default router;