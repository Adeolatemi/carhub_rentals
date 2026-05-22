// server/src/routes/booking-verify.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Paystack from 'paystack-sdk';
import { createCanvas, loadImage } from 'canvas';
import * as faceapi from 'face-api.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Paystack
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

// Upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `carhub/${folder}`, public_id: fileName },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Load face-api models (run once)
let modelsLoaded = false;
const loadFaceModels = async () => {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
    modelsLoaded = true;
  }
};

// Compare faces
const compareFaces = async (selfieBuffer, licenseBuffer) => {
  await loadFaceModels();
  
  const selfieImage = await loadImage(selfieBuffer);
  const licenseImage = await loadImage(licenseBuffer);
  
  const selfieDetection = await faceapi.detectSingleFace(selfieImage).withFaceLandmarks().withFaceDescriptor();
  const licenseDetection = await faceapi.detectSingleFace(licenseImage).withFaceLandmarks().withFaceDescriptor();
  
  if (!selfieDetection || !licenseDetection) {
    return { matched: false, score: 0, error: 'Face not detected in one or both images' };
  }
  
  const distance = faceapi.euclideanDistance(selfieDetection.descriptor, licenseDetection.descriptor);
  const matchScore = 1 - distance;
  const matched = matchScore > 0.6;
  
  return { matched, score: matchScore };
};

// Car types data
const CAR_TYPES = [
  { id: 'saloon', name: 'Saloon Car', dailyRate: 25000, capacity: 4, image: '/images/saloon.jpg' },
  { id: 'suv', name: 'SUV', dailyRate: 45000, capacity: 5, image: '/images/suv.jpg' },
  { id: 'luxury', name: 'Luxury Sedan', dailyRate: 75000, capacity: 4, image: '/images/luxury.jpg' },
  { id: 'hiace', name: 'Hiace Bus', dailyRate: 80000, capacity: 14, image: '/images/hiace.jpg' },
  { id: 'coaster', name: 'Coaster Bus', dailyRate: 120000, capacity: 32, image: '/images/coaster.jpg' }
];

// Service types
const SERVICE_TYPES = [
  'Airport Transfer', 'Business Meeting', 'Event Transportation',
  'City Tour', 'Wedding Transport', 'Shopping Trip', 'Other'
];

// Locations
const LOCATIONS = [
  'Murtala Muhammed Airport (MMA)', 'Lagos Island', 'Victoria Island', 'Ikoyi',
  'Lekki Phase 1', 'Lekki Phase 2', 'Ajah', 'Maryland', 'Ikeja', 'GRA Ikeja',
  'Surulere', 'Yaba', 'Ogba', 'Agege', 'Badagry', 'Ikorodu', 'Epe'
];

// Get car types
router.get('/car-types', (req, res) => {
  res.json(CAR_TYPES);
});

// Get service types
router.get('/service-types', (req, res) => {
  res.json(SERVICE_TYPES);
});

// Get locations
router.get('/locations', (req, res) => {
  res.json(LOCATIONS);
});

// Calculate price
router.post('/calculate-price', (req, res) => {
  try {
    const { carTypeId, totalDays, driverRequired } = req.body;
    const car = CAR_TYPES.find(c => c.id === carTypeId);
    
    if (!car) {
      return res.status(404).json({ error: 'Car type not found' });
    }
    
    const subtotal = car.dailyRate * totalDays;
    const VAT_RATE = 0.075;
    const vat = subtotal * VAT_RATE;
    const TAX_RATE = 0.005;
    const tax = subtotal * TAX_RATE;
    const driverFee = driverRequired ? 10000 * totalDays : 0;
    const grandTotal = subtotal + vat + tax + driverFee;
    
    res.json({
      carType: car.name,
      dailyRate: car.dailyRate,
      totalDays,
      subtotal,
      vat,
      tax,
      driverFee,
      grandTotal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking with full verification
router.post('/create', upload.fields([
  { name: 'driverLicense', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
  { name: 'nepaBill', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      fullName, email, phone, pickupLocation, destination,
      carTypeId, serviceType, pickupDate, pickupTime, passengers,
      specialRequests, driverRequired, driverLicenseNumber,
      totalDays
    } = req.body;
    
    const files = req.files;
    const car = CAR_TYPES.find(c => c.id === carTypeId);
    
    if (!car) {
      return res.status(400).json({ error: 'Invalid car type' });
    }
    
    // Calculate price
    const subtotal = car.dailyRate * parseInt(totalDays);
    const vat = subtotal * 0.075;
    const tax = subtotal * 0.005;
    const driverFee = driverRequired === 'true' ? 10000 * parseInt(totalDays) : 0;
    const grandTotal = subtotal + vat + tax + driverFee;
    
    // Upload documents and perform face verification
    let driverLicenseUrl = null;
    let selfieUrl = null;
    let faceVerified = false;
    let faceMatchScore = 0;
    let licenseVerified = false;
    
    if (files?.driverLicense) {
      const licenseResult = await uploadToCloudinary(
        files.driverLicense[0].buffer,
        'documents/license',
        `${email}_license_${Date.now()}`
      );
      driverLicenseUrl = licenseResult.secure_url;
      
      // If selfie also provided, perform face matching
      if (files?.selfie) {
        const selfieResult = await uploadToCloudinary(
          files.selfie[0].buffer,
          'verification/selfie',
          `${email}_selfie_${Date.now()}`
        );
        selfieUrl = selfieResult.secure_url;
        
        // Perform face comparison
        const faceMatch = await compareFaces(files.selfie[0].buffer, files.driverLicense[0].buffer);
        faceVerified = faceMatch.matched;
        faceMatchScore = faceMatch.score;
        licenseVerified = faceMatch.matched;
      }
    }
    
    let nepabillUrl = null;
    if (files?.nepaBill) {
      const nepaResult = await uploadToCloudinary(
        files.nepaBill[0].buffer,
        'documents/nepa',
        `${email}_nepa_${Date.now()}`
      );
      nepabillUrl = nepaResult.secure_url;
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        fullName, email, phone, pickupLocation, destination,
        carType: carTypeId,
        carTypeName: car.name,
        carDailyRate: car.dailyRate,
        serviceType, pickupDate: new Date(pickupDate),
        pickupTime, passengers: parseInt(passengers),
        specialRequests, driverRequired: driverRequired === 'true',
        driverLicenseNumber, driverLicenseUrl,
        selfieUrl, faceVerified, faceMatchScore,
        driverLicenseVerified: licenseVerified,
        nepabillUrl, totalDays: parseInt(totalDays),
        subtotal, vat, tax, driverFee, grandTotal,
        status: 'pending', paymentStatus: 'unpaid'
      }
    });
    
    // Initialize Paystack payment
    const payment = await paystack.transaction.initialize({
      email,
      amount: Math.round(grandTotal * 100),
      callback_url: `${process.env.FRONTEND_URL}/booking/verify`,
      metadata: {
        booking_id: booking.id,
        customer_name: fullName,
        car_type: car.name,
        total_days: totalDays
      }
    });
    
    // Update booking with payment URL
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentUrl: payment.data.authorization_url, paymentReference: payment.data.reference }
    });
    
    res.json({
      success: true,
      bookingId: booking.id,
      faceVerified,
      faceMatchScore,
      licenseVerified,
      paymentUrl: payment.data.authorization_url,
      paymentReference: payment.data.reference,
      priceBreakdown: { subtotal, vat, tax, driverFee, grandTotal }
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.get('/verify-payment/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const payment = await paystack.transaction.verify({ reference });
    
    if (payment.data.status === 'success') {
      const booking = await prisma.booking.update({
        where: { paymentReference: reference },
        data: {
          paymentStatus: 'paid',
          status: 'confirmed'
        }
      });
      
      res.json({ success: true, status: 'success', booking });
    } else {
      res.json({ success: false, status: 'failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;