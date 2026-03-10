import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireRole } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// Create vehicle (admin/partner)
router.post("/", authenticate, requireRole(["SUPERADMIN", "ADMIN", "PARTNER"]), async (req, res) => {
  try {
    const { title, description, dailyRate, categoryId } = req.body;
    const v = await prisma.vehicle.create({ data: { title, description, dailyRate: Number(dailyRate), categoryId } });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get vehicle by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const v = await prisma.vehicle.findUnique({ where: { id } });
    if (!v) return res.status(404).json({ error: "Not found" });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List vehicles with optional filters
router.get("/", async (req, res) => {
  try {
    const { q, available, minRate, maxRate, category } = req.query as any;
    const where: any = {};
    if (q) where.OR = [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
    if (available !== undefined) where.available = available === "true";
    if (minRate || maxRate) where.dailyRate = {};
    if (minRate) where.dailyRate.gte = Number(minRate);
    if (maxRate) where.dailyRate.lte = Number(maxRate);
    if (category) where.categoryId = category;
    const list = await prisma.vehicle.findMany({ where });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delist a vehicle
router.patch("/:id/delist", authenticate, requireRole(["SUPERADMIN", "ADMIN", "PARTNER"]), async (req, res) => {
  try {
    const { id } = req.params;
    const v = await prisma.vehicle.update({ where: { id }, data: { available: false } });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
