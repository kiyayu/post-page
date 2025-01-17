import nodemailer from "nodemailer";
import { environment } from "../config/environment.js";
import { emailTemplates } from "./emailTemplates.js";
import { logEmailError } from "./logger.js";
import { emailRateLimiter } from "./rateLimiter.js";

// Email validation utility
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Using Gmail's SMTP service
  auth: {
    user: environment.email.user, // Your Gmail address
    pass: environment.email.pass, // Your Gmail app password
  },
});

// Helper function to create email templates
const createEmailTemplate = (
  title,
  buttonText,
  buttonUrl,
  additionalText = "" 
) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; }
        .footer { font-size: 12px; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <a href="${buttonUrl}" class="button">${buttonText}</a>
        <p>${additionalText}</p>
      </div>
    </body>
  </html>
`;

// Send verification email
export const sendVerificationEmail = async (email, token, locale = "en") => {
  await emailRateLimiter.checkLimit(email);

  if (!isValidEmail(email)) throw new Error("Invalid email address");
  if (!token) throw new Error("Token is required");

  const verificationUrl = `${environment.server.baseUrl}/verify-email/${token}`;
  const template = emailTemplates[locale]?.verification;

  const emailData = {
    from: `"MyWebsite" <${environment.email.user}>`,
    to: email,
    subject: template.subject,
    html: createEmailTemplate(
      template.title,
      template.buttonText,
      verificationUrl,
      template.additionalText
    ),
  };

  try {
    const data = await transporter.sendMail(emailData);
    console.log("Verification email sent successfully:", data);
    return data;
  } catch (error) {
    logEmailError(error, "verification", email);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  if (!isValidEmail(email)) throw new Error("Invalid email address");
  if (!token) throw new Error("Token is required");

  const resetUrl = `${environment.server.baseUrl}/reset-password/${token}`;
  const emailData = {
    from: `"MyWebsite" <${environment.email.user}>`,
    to: email,
    subject: "Password Reset Request",
    html: createEmailTemplate(
      "Reset Your Password",
      "Reset Password",
      resetUrl,
      "This link will expire in 1 hour. If you did not request a password reset, please ignore this email."
    ),
  };

  try {
    const data = await transporter.sendMail(emailData);
    console.log("Password reset email sent successfully:", data);
    return data;
  } catch (error) {
    logEmailError(error, "password-reset", email);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name, locale = "en") => {
  if (!isValidEmail(email)) throw new Error("Invalid email address");
  if (!name) throw new Error("Name is required");

  const template = emailTemplates[locale]?.welcome;
  const emailData = {
    from: `"MyWebsite" <${environment.email.user}>`,
    to: email,
    subject: template.subject,
    html: createEmailTemplate(
      template.title.replace("{name}", name),
      template.buttonText,
      `${environment.server.baseUrl}/login`,
      template.additionalText
    ),
  };

  try {
    const data = await transporter.sendMail(emailData);
    
    return data;
  } catch (error) {
    logEmailError(error, "welcome", email);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
};

// Send contact email
export const sendContactEmail = async (senderEmail, senderName, message) => {
  if (!isValidEmail(senderEmail)) {
    throw new Error("Invalid sender email address");
  }
  if (!senderName || !message) {
    throw new Error("Name and message are required");
  }

  const emailData = {
    from: `"${senderName}" <${environment.email.user}>`, // Use your verified email as the actual sender
    to: environment.email.recipient_email,
    replyTo: senderEmail, // User's email (for replies)
    subject: `Contact Form Submission from ${senderName}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${senderName}</p>
      <p><strong>Email:</strong> ${senderEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    const data = await transporter.sendMail(emailData);
    console.log("Contact email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to send contact email:", error);
    throw new Error(`Failed to send contact email: ${error.message}`);
  }
};
