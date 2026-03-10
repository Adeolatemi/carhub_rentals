
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";
import { createPayment, verifyWebhook } from "../services/monnify";
import { sendEmail, sendSMS } from "../services/notifications";
import multer from "multer";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
const router = Router();

/* ------------------------------------------------ */
/* FILE UPLOAD CONFIG */
/* ------------------------------------------------ */

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "orders");
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_ROOT),

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/* ------------------------------------------------ */
/* GET USER'S ORDERS */
/* ------------------------------------------------ */

router.get("/my-orders", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        attachments: true,
      },
    });
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------------------------------ */
/* GET ORDER BY ID */
/* ------------------------------------------------ */

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const order = await prisma.order.findFirst({
      where: { 
        id,
        OR: [
          { userId },
          { user: { role: req.user.role } }
        ]
      },
      include: {
        attachments: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
      },
    });
    
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------------------------------ */
/* CREATE ORDER */
/* ------------------------------------------------ */

router.post(
  "/request",
  authenticate,
  upload.fields([
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
    { name: "passport", maxCount: 1 },
  ]),
  async (req: AuthRequest, res) => {
    try {
      const { vehicleId, startDate, endDate, totalAmount, pickupLocation, dropoffLocation } = req.body;
      const userId = req.user.id;

      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      const order = await prisma.order.create({
        data: {
          userId,
          vehicleId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalAmount: Number(totalAmount),
          pickupLocation,
          dropoffLocation,
          status: "PENDING",
        },
      });

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      if (files) {
        const attachments = [];

        for (const key of Object.keys(files)) {
          const fileArr = files[key];

          for (const file of fileArr) {
            const relativePath = `/uploads/orders/${path.basename(file.path)}`;

            attachments.push({
              orderId: order.id,
              path: relativePath,
              type: key,
            });
          }
        }

        if (attachments.length) {
          await prisma.orderAttachment.createMany({
            data: attachments,
          });
        }
      }

      const orderWithFiles = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          attachments: true,
        },
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await sendEmail(
          user.email,
          "Order Created",
          `Your car rental order #${order.id.slice(0, 8)} has been created. Please complete payment to confirm.`,
          `<p>Your car rental order <strong>#${order.id.slice(0, 8)}</strong> has been created.</p><p>Please complete payment to confirm your booking.</p>`
        );
      }

      res.json(orderWithFiles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ------------------------------------------------ */
/* CHECKOUT */
/* ------------------------------------------------ */

router.post("/checkout/:orderId", authenticate, async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.userId !== req.user.id && !["SUPERADMIN", "ADMIN", "PARTNER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const callback = `${process.env.WEBHOOK_BASE || "http://localhost:4000"}/orders/webhooks/monnify`;

    const payment = await createPayment({
      amount: order.totalAmount,
      customerEmail: req.user.email,
      callbackUrl: callback,
    });

    const tx = await prisma.transaction.create({
      data: {
        orderId: order.id,
        provider: payment.provider,
        providerRef: payment.reference,
        amount: order.totalAmount,
      },
    });

    res.json({ payment, tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------------------------------ */
/* CANCEL ORDER */
/* ------------------------------------------------ */

router.post("/:id/cancel", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const order = await prisma.order.findUnique({ where: { id } });
    
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    if (order.userId !== req.user.id && !["SUPERADMIN", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    if (order.status !== "PENDING") {
      return res.status(400).json({ error: "Can only cancel pending orders" });
    }
    
    const updated = await prisma.order.update({
      where: { id },
      data: { 
        status: "CANCELED",
        canceledReason: reason || "User requested cancellation"
      },
    });
    
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------------------------------ */
/* ADMIN UPDATE ORDER */
/* ------------------------------------------------ */

router.patch(
  "/:id/status",
  authenticate,
  requireRole(["SUPERADMIN", "ADMIN", "PARTNER"]),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status, adminNote, canceledReason } = req.body;

      const updated = await prisma.order.update({
        where: { id },
        data: { status, adminNote, canceledReason },
      });

      const orderWithUser = await prisma.order.findUnique({
        where: { id },
        include: { user: true },
      });

      if (orderWithUser?.user) {
        const message = `Your order #${id.slice(0, 8)} status is now ${updated.status}`;

        await sendEmail(
          orderWithUser.user.email,
          "Order Status Update",
          message,
          `<p>${message}</p>`
        );

        if ((orderWithUser.user as any).phone) {
          await sendSMS((orderWithUser.user as any).phone, message);
        }
      }

      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ------------------------------------------------ */
/* ADMIN LIST ORDERS */
/* ------------------------------------------------ */

router.get(
  "/",
  authenticate,
  requireRole(["SUPERADMIN", "ADMIN", "PARTNER"]),
  async (req: AuthRequest, res) => {
    try {
      const { status, userId, vehicleId } = req.query;
      
      const where: any = {};
      if (status) where.status = status as string;
      if (userId) where.userId = userId as string;
      if (vehicleId) where.vehicleId = vehicleId as string;

      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          attachments: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          },
        },
      });

      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ------------------------------------------------ */
/* MONNIFY WEBHOOK */
/* ------------------------------------------------ */

router.post("/webhooks/monnify", async (req: AuthRequest, res) => {
  try {
    const signature = req.headers["x-signature"] as string | undefined;

    if (!verifyWebhook(req.body, signature)) {
      return res.status(400).json({ error: "Invalid webhook" });
    }

    const event = req.body;

    const ref = event.reference || event.data?.reference;
    const status = event.paymentStatus || event.data?.paymentStatus;

    if (!ref) return res.status(400).json({ error: "Missing reference" });

    const tx = await prisma.transaction.findUnique({
      where: { providerRef: ref },
    });

    if (!tx) return res.status(404).json({ error: "Transaction not found" });

    if (status === "PAID" || status === "SUCCESS") {
      await prisma.order.update({
        where: { id: tx.orderId },
        data: { status: "CONFIRMED" },
      });
    }

    if (status === "FAILED") {
      await prisma.order.update({
        where: { id: tx.orderId },
        data: { status: "PENDING" },
      });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;


