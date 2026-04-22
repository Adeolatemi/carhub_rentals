import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send verification email
export async function sendVerificationEmail(email: string, code: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1D3557;">Welcome to CarHub! 🚗</h2>
      <p>Thank you for signing up. Please verify your email address by entering the code below:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold;">
        ${code}
      </div>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <p style="color: #666; font-size: 12px;">CarHub - Premium Car Hire Service</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"CarHub" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Email - CarHub',
    html,
  });
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1D3557;">Welcome to CarHub, ${name}! 🎉</h2>
      <p>Your account has been successfully created and verified.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse our fleet of premium vehicles</li>
        <li>Book rides instantly</li>
        <li>Track your bookings</li>
        <li>Manage your profile</li>
      </ul>
      <p>Need help? Contact our support team at support@carhub.com</p>
      <hr />
      <p style="color: #666; font-size: 12px;">CarHub - Premium Car Hire Service</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"CarHub" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to CarHub! 🚗',
    html,
  });
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string, resetUrl: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1D3557;">Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}?token=${token}" style="background-color: #F4D35E; color: #0A2342; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p>Or copy this link: ${resetUrl}?token=${token}</p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <p style="color: #666; font-size: 12px;">CarHub - Premium Car Hire Service</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"CarHub" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password - CarHub',
    html,
  });
}