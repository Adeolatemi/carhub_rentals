// server/src/routes/booking-verify.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { randomBytes } from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `carhub/${folder}`,
        public_id: fileName,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function to generate unique filename
const generateFileName = (userId, documentType) => {
  const timestamp = Date.now();
  const random = randomBytes(8).toString('hex');
  return `${userId}_${documentType}_${timestamp}_${random}`;
};

// Calculate booking price
const calculateBookingPrice = (vehicle, startDate, endDate, options = {}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) throw new Error('End date must be after start date');
  
  const subtotal = vehicle.dailyRate * totalDays;
  
  // Nigerian VAT is 7.5%
  const VAT_RATE = 0.075;
  const vat = subtotal * VAT_RATE;
  
  // Local government tax (varies by state, using 0.5% as example)
  const TAX_RATE = 0.005;
  const tax = subtotal * TAX_RATE;
  
  let driverFee = 0;
  if (options.driverRequired) {
    driverFee = 10000 * totalDays;
  }
  
  const grandTotal = subtotal + vat + tax + driverFee;
  
  return {
    totalDays,
    dailyRate: vehicle.dailyRate,
    subtotal,
    vat,
    tax,
    driverFee,
    grandTotal,
    currency: 'NGN'
  };
};

// Get available vehicles for booking
router.get('/available-vehicles', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const vehicles = await prisma.vehicle.findMany({
      where: {
        available: true,
      }
    });
    
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Calculate price (no auth needed for estimation)
router.post('/calculate-price', async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, driverRequired } = req.body;
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    const priceBreakdown = calculateBookingPrice(vehicle, startDate, endDate, { driverRequired });
    
    res.json(priceBreakdown);
  } catch (error) {
    console.error('Price calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

// Create booking with document uploads and verification
router.post('/create', upload.fields([
  { name: 'idDocument', maxCount: 1 },
  { name: 'utilityBill', maxCount: 1 },
  { name: 'driverLicense', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Get user from token (simplified - implement your auth middleware)
    const userId = req.body.userId; // Replace with actual user ID from token
    
    const {
      vehicleId,
      startDate,
      endDate,
      driverRequired,
      driverLicenseNumber,
      licenseDob,
      utilityAddress
    } = req.body;
    
    const files = req.files;
    
    // Get vehicle details
    const vehicle = await prisma.vehicle.findUnique({ 
      where: { id: vehicleId } 
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Calculate price
    const priceBreakdown = calculateBookingPrice(vehicle, startDate, endDate, { 
      driverRequired: driverRequired === 'true' 
    });
    
    // Upload documents
    const documentUrls = {};
    
    if (files && files.idDocument) {
      const result = await uploadToCloudinary(
        files.idDocument[0].buffer, 
        'documents/id', 
        generateFileName(userId, 'id')
      );
      documentUrls.idDocument = result.secure_url;
    }
    
    if (files && files.utilityBill) {
      const result = await uploadToCloudinary(
        files.utilityBill[0].buffer, 
        'documents/utility', 
        generateFileName(userId, 'utility')
      );
      documentUrls.utilityBill = result.secure_url;
    }
    
    if (files && files.driverLicense) {
      const result = await uploadToCloudinary(
        files.driverLicense[0].buffer, 
        'documents/license', 
        generateFileName(userId, 'license')
      );
      documentUrls.driverLicense = result.secure_url;
    }
    
    if (files && files.selfie) {
      const result = await uploadToCloudinary(
        files.selfie[0].buffer, 
        'verification/selfie', 
        generateFileName(userId, 'selfie')
      );
      documentUrls.selfie = result.secure_url;
    }
    
    // Create booking
    const booking = await prisma.enhancedBooking.create({
      data: {
        userId: userId,
        vehicleId: vehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays: priceBreakdown.totalDays,
        dailyRate: priceBreakdown.dailyRate,
        subtotal: priceBreakdown.subtotal,
        vat: priceBreakdown.vat,
        tax: priceBreakdown.tax,
        driverFee: priceBreakdown.driverFee,
        grandTotal: priceBreakdown.grandTotal,
        driverRequired: driverRequired === 'true',
        idDocument: documentUrls.idDocument,
        utilityBill: documentUrls.utilityBill,
        driverLicense: documentUrls.driverLicense,
        selfieImage: documentUrls.selfie,
        verificationStatus: 'pending',
        status: 'pending',
        paymentStatus: 'unpaid'
      }
    });
    
    // Create verification log
    await prisma.verificationLog.create({
      data: {
        bookingId: booking.id,
        type: 'initial_verification',
        status: 'pending',
        metadata: {
          licenseNumber: driverLicenseNumber,
          licenseDob: licenseDob,
          utilityAddress: utilityAddress
        }
      }
    });
    
    // Return booking info for payment
    res.json({
      success: true,
      bookingId: booking.id,
      paymentUrl: `/payment/${booking.id}`,
      priceBreakdown,
      booking: booking
    });
    
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
});

// Get booking details
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await prisma.enhancedBooking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

export default router;