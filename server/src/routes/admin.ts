import { Router } from "express";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";

const router = Router();

// ==================== STATISTICS ====================
router.get("/stats", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const [totalUsers, totalVehicles, totalOrders, completedOrders, pendingOrders, canceledOrders, totalRevenue, monthlyRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "CONFIRMED" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "CANCELED" } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "CONFIRMED" } }),
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { 
          status: "CONFIRMED",
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        } 
      }),
    ]);

    res.json({
      totalUsers,
      totalVehicles,
      totalOrders,
      completedOrders,
      pendingOrders,
      canceledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// ==================== BOOKINGS ====================
router.get("/bookings", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const bookings = await prisma.carBooking.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.patch("/bookings/:id", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await prisma.carBooking.update({
      where: { id },
      data: { status },
    });
    res.json(booking);
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// ==================== ORDERS ====================
router.get("/orders", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        vehicle: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        vehicle: { select: { id: true, title: true, dailyRate: true } },
      },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.patch("/orders/:orderId", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNote } = req.body;
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status, adminNote },
    });
    res.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// ==================== USERS ====================
router.get("/users", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/admins", authenticate, requireRole(["SUPERADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashedPassword, role: role || "ADMIN", isActive: true },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

router.post("/partners", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { name, email, password, phone, company } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashedPassword, role: "PARTNER", isActive: true, phone, company },
      select: { id: true, name: true, email: true, role: true, isActive: true, phone: true, company: true },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Create partner error:", error);
    res.status(500).json({ error: "Failed to create partner" });
  }
});

// ==================== VEHICLES ====================
router.get("/vehicles", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(vehicles);
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

router.post("/vehicles", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { title, description, dailyRate, imageUrl } = req.body;
    const vehicle = await prisma.vehicle.create({
      data: { title, description, dailyRate: parseFloat(dailyRate), imageUrl, available: true },
    });
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({ error: "Failed to create vehicle" });
  }
});

router.delete("/vehicles/:id", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({ where: { id } });
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
});

// ==================== CONTACT MESSAGES ====================
type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: Date;
};

router.get("/contact-messages", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    console.log('Fetching contact messages...');
    
    const messages = await prisma.$queryRaw<ContactMessage[]>`
      SELECT id, name, email, phone, subject, message, status, created_at as createdAt
      FROM contact_messages 
      ORDER BY created_at DESC
    `;
    
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.put("/contact-messages/:id", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await prisma.$executeRaw`
      UPDATE contact_messages 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
    `;
    
    res.json({ success: true, message: "Message updated successfully" });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Failed to update message" });
  }
});

router.delete("/contact-messages/:id", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    await prisma.$executeRaw`
      DELETE FROM contact_messages WHERE id = ${id}
    `;
    
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});
// Get all contact messages with pagination
router.get("/contact-messages", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    const params: any[] = [];
    
    if (status && status !== 'all') {
      whereClause = `WHERE status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (search) {
      const searchTerm = `%${search}%`;
      whereClause = whereClause ? `${whereClause} AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR subject ILIKE $${params.length + 1})` 
        : `WHERE (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR subject ILIKE $${params.length + 1})`;
      params.push(searchTerm);
    }
    
    const countResult = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
      ...params
    );
    const total = parseInt(countResult[0].total);
    
    const messages = await prisma.$queryRawUnsafe(
      `SELECT id, name, email, phone, subject, message, status, created_at as "createdAt"
       FROM contact_messages ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      ...params, limit, offset
    );
    
    res.json({
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
import nodemailer from 'nodemailer';

// Email transporter (use your existing email configuration)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send reply email
router.post("/reply-message", authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { to, subject, message } = req.body;
    
    await transporter.sendMail({
      from: `"CarHub Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A2342; color: white; padding: 20px; text-align: center;">
            <h2>CarHub Support</h2>
          </div>
          <div style="padding: 20px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>CarHub Rentals | Lagos, Nigeria | <a href="https://carhub-rentals.vercel.app">carhub-rentals.vercel.app</a></p>
          </div>
        </div>
      `,
    });
    
    res.json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ error: "Failed to send reply" });
  }
});
export default router;