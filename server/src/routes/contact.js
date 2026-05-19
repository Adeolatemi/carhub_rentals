// server/src/routes/contact.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const router = express.Router();
const prisma = new PrismaClient();

// Create contact table if not exists
async function ensureContactTable() {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Contact table ready');
  } catch (error) {
    console.error('Contact table error:', error);
  }
}
ensureContactTable();

// Email transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.sendinblue.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const fullPhone = phone || '';

    // Save to database
    await prisma.$executeRaw`
      INSERT INTO contact_messages (id, name, email, phone, subject, message, status)
      VALUES (gen_random_uuid(), ${name}, ${email}, ${fullPhone}, ${subject}, ${message}, 'pending')
    `;
    console.log('✅ Contact message saved to database');

    // Email to admin
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0A2342; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #F4D35E; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h2>📬 New Contact Form Submission</h2></div>
          <div class="content">
            <div class="info"><strong>Name:</strong> ${name}</div>
            <div class="info"><strong>Email:</strong> ${email}</div>
            <div class="info"><strong>Phone:</strong> ${fullPhone || 'Not provided'}</div>
            <div class="info"><strong>Subject:</strong> ${subject}</div>
            <div class="info"><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"CarHub Contact" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'adeolafatosin@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: adminHtml,
    });
    console.log('✅ Admin email sent via Brevo');

    // Auto-reply to user
    const userHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0A2342; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h2>Thank You for Contacting CarHub!</h2></div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to CarHub Rentals. We have received your message and will get back to you within 24 hours.</p>
            <p><strong>Your message:</strong> "${message}"</p>
            <p>Best regards,<br><strong>The CarHub Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"CarHub Rentals" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'We received your message - CarHub Rentals',
      html: userHtml,
    });
    console.log('✅ User auto-reply sent');

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Get contact messages (admin only)
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.$queryRaw`
      SELECT * FROM contact_messages ORDER BY created_at DESC
    `;
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
// Submit contact form - always return success if saved to database
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const fullPhone = phone || '';

    // Save to database
    await prisma.$executeRaw`
      INSERT INTO contact_messages (id, name, email, phone, subject, message, status)
      VALUES (gen_random_uuid(), ${name}, ${email}, ${fullPhone}, ${subject}, ${message}, 'pending')
    `;
    console.log('✅ Contact message saved to database');

    // Try to send email, but don't fail if it doesn't work
    try {
      // Email to admin
      await transporter.sendMail({
        from: `"CarHub Contact" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'adeolafatosin@gmail.com',
        subject: `Contact Form: ${subject}`,
        html: adminHtml,
      });
      console.log('✅ Admin email sent');
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError.message);
      // Don't return error - message is already saved
    }

    try {
      // Auto-reply to user
      await transporter.sendMail({
        from: `"CarHub Rentals" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'We received your message - CarHub Rentals',
        html: userHtml,
      });
      console.log('✅ User auto-reply sent');
    } catch (emailError) {
      console.error('Auto-reply failed (non-critical):', emailError.message);
      // Don't return error - message is already saved
    }

    // ALWAYS return success if message was saved to database
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    // Only return error if database save failed
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});


export default router;