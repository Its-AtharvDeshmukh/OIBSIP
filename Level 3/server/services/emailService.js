import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Pizza Delivery" <noreply@pizzadelivery.com>',
      to,
      subject,
      text,
      html
    });
    console.log(`Email dispatched to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[DEV NOTE: SMTP Notification - Logged to terminal for testing]`);
    console.log(`----------------------------------------`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT:\n${text || html}`);
    console.log(`----------------------------------------`);
    return { success: false, error: error.message };
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${token}`;
  const html = `
    <h2>Welcome to Pizza Delivery!</h2>
    <p>Please click the button below to verify your email address and activate your account:</p>
    <a href="${verifyUrl}" style="background:#e11d48;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Verify Account</a>
    <p>Or copy this link to your browser: <br>${verifyUrl}</p>
  `;
  const text = `Verify your account by visiting: ${verifyUrl}`;

  return await sendEmail({
    to: email,
    subject: 'Verify Your Pizza Delivery Account',
    html,
    text
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the button below to set a new password (valid for 15 minutes):</p>
    <a href="${resetUrl}" style="background:#0f172a;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Reset Password</a>
    <p>Or copy this link to your browser: <br>${resetUrl}</p>
  `;
  const text = `Reset your password by visiting: ${resetUrl}`;

  return await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
    text
  });
};

export const sendLowStockAlertEmail = async (adminEmail, lowStockItems) => {
  const itemsListHtml = lowStockItems
    .map(
      (item) => `
        <li style="margin-bottom: 8px;">
          <strong>${item.name}</strong> (${item.category.toUpperCase()}): 
          <span style="color: #dc2626; font-weight: bold;">Current Stock: ${item.stock}</span> 
          (Configured Threshold: ${item.threshold})
        </li>
      `
    )
    .join('');

  const itemsListText = lowStockItems
    .map((item) => `- ${item.name} [${item.category}]: Stock ${item.stock} (Threshold ${item.threshold})`)
    .join('\n');

  const html = `
    <h2 style="color: #b91c1c;">⚠️ Action Required: Low Inventory Alert</h2>
    <p>The automated inventory monitor detected ingredients that have fallen below their configured safety thresholds:</p>
    <ul>
      ${itemsListHtml}
    </ul>
    <p>Please log in to the <strong>Admin Dashboard</strong> to review and restock supplies before orders are affected.</p>
  `;

  const text = `Low Inventory Alert:\n${itemsListText}\n\nPlease restock via the Admin Dashboard.`;

  return await sendEmail({
    to: adminEmail,
    subject: '⚠️ Automated Inventory Alert: Ingredients Below Threshold',
    html,
    text
  });
};