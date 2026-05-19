// server/src/routes/admin.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cacheService from '../services/cache.service.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all contact messages (FIXED: removed duplicate /admin prefix)
router.get('/contact-messages', authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req, res) => {
  try {
    console.log('Fetching contact messages...');
    
    // Check if table exists
    const tableCheck = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'contact_messages'
      )
    `;
    
    if (!tableCheck[0].exists) {
      console.log('Contact messages table does not exist yet');
      return res.json([]);
    }
    
    const messages = await prisma.$queryRaw`
      SELECT id, name, email, phone, subject, message, status, created_at as createdAt
      FROM contact_messages 
      ORDER BY created_at DESC
    `;
    
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update contact message status (FIXED: removed duplicate /admin prefix)
router.put('/contact-messages/:id', authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await prisma.$executeRaw`
      UPDATE contact_messages 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
    `;
    
    res.json({ success: true, message: 'Message updated successfully' });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete contact message (FIXED: removed duplicate /admin prefix)
router.delete('/contact-messages/:id', authenticate, requireRole(["SUPERADMIN", "ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.$executeRaw`
      DELETE FROM contact_messages WHERE id = ${id}
    `;
    
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// GET /stats - Get admin dashboard statistics with caching (FIXED: removed duplicate /admin prefix)
router.get('/stats', async (req, res) => {
  try {
    let stats = await cacheService.get('admin:stats');
    
    if (!stats) {
      console.log('📝 Cache miss - fetching stats from database...');
      
      const [revenueResult, usersCount, vehiclesCount, ordersCount, completedOrders, pendingOrders] = await Promise.all([
        prisma.order.aggregate({
          where: { status: 'CONFIRMED' },
          _sum: { totalAmount: true },
        }),
        prisma.user.count(),
        prisma.vehicle.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'CONFIRMED' } }),
        prisma.order.count({ where: { status: 'PENDING' } }),
      ]);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyRevenue = await prisma.order.aggregate({
        where: {
          status: 'CONFIRMED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { totalAmount: true },
      });

      stats = {
        totalRevenue: revenueResult._sum.totalAmount || 0,
        totalUsers: usersCount,
        totalVehicles: vehiclesCount,
        totalOrders: ordersCount,
        completedOrders: completedOrders,
        pendingOrders: pendingOrders,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      };
      
      await cacheService.set('admin:stats', stats, 300);
      console.log('✅ Stats cached');
    } else {
      console.log('✅ Cache hit for admin stats');
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// PUT /vehicles/:id - Update vehicle with cache invalidation
router.put('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    
    await cacheService.del(`vehicle:${id}`);
    await cacheService.delPattern('vehicles:*');
    await cacheService.del('admin:stats');
    console.log(`🗑️ Cache invalidated for vehicle: ${id}`);
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// POST /vehicles - Add new vehicle with cache invalidation
router.post('/vehicles', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.create({
      data: req.body,
    });
    
    await cacheService.delPattern('vehicles:*');
    await cacheService.del('admin:stats');
    console.log(`🗑️ Cache invalidated - new vehicle added: ${vehicle.id}`);
    
    res.json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// DELETE /vehicles/:id - Delete vehicle with cache invalidation
router.delete('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({
      where: { id: parseInt(id) },
    });
    
    await cacheService.delPattern('vehicles:*');
    await cacheService.del('admin:stats');
    console.log(`🗑️ Cache invalidated - vehicle deleted: ${id}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

export default router;