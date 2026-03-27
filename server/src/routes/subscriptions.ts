import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";
import { createPayment, verifyPayment } from "../services/monnify";

const prisma = new PrismaClient();
const router = Router();

const FRONTEND_BASE = process.env.FRONTEND_BASE || "http://localhost:5173";

// Get current subscription
router.get("/me", authenticate, requireRole(["PARTNER"]), async (req: AuthRequest, res) => {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Subscribe
router.post("/subscribe", authenticate, requireRole(["PARTNER"]), async (req: AuthRequest, res) => {
  try {
    const { plan } = req.body; // "BASIC" | "PRO"
    if (!["BASIC", "PRO"].includes(plan)) return res.status(400).json({ error: "Invalid plan" });
    
    const amount = plan === "BASIC" ? 5000 : 15000;
    const callbackUrl = `${FRONTEND_BASE}/partner/dashboard`;
    
    const payment = await createPayment({
      amount,
      customerEmail: req.user.email,
      callbackUrl
    });
    
    res.json({ 
      success: true, 
      paymentUrl: payment.paymentUrl, 
      reference: payment.reference,
      amount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Subscription failed" });
  }
});

// Webhook/callback verify (public or auth)
router.post("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const verification = await verifyPayment(reference);
    
    if (verification.status === "PAID") {
      // Update subscription (assume reference has user context or from metadata)
      // For simplicity, get user from transaction or use auth if provided
      // Here assume manual verify from dashboard
      res.json({ success: true, status: "PAID" });
    } else {
      res.json({ success: false, status: verification.status });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
