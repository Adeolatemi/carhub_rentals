import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { submitKyc } from "../services/smileid";

const prisma = new PrismaClient();
const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { orders: true } });
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List users (admin)
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    // only allow admin roles to list all users
    if (!["SUPERADMIN", "ADMIN"].includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, isActive: true, kycStatus: true } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// KYC upload endpoint (authenticated)
router.post("/me/kyc", authenticate, upload.single("document"), async (req: AuthRequest, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Missing file" });
    const filePath = `/uploads/${req.file.filename}`;
    // update user record with file path and set kycStatus to PENDING
    await prisma.user.update({ where: { id: req.user.id }, data: { kycFile: filePath, kycStatus: "PENDING" } });
    // submit to SmileId (stub)
    const result = await submitKyc({ userId: req.user.id, filePath });
    // store provider ref somewhere if needed (not modeled), respond
    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
