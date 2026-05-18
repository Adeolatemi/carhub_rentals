// server/src/services/resend.service.js
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email (must be verified in Resend dashboard)
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Send an email using Resend API
 */
export const sendEmail = async ({ to, subject, html, text, from = DEFAULT_FROM }) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Email sent to ${to}: ${data?.id}`);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default { sendEmail, isValidEmail };