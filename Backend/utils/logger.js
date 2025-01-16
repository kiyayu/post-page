// utils/logger.js
export const logEmailError = (error, emailType, recipient) => {
  console.error(`Email Error [${emailType}] to ${recipient}:`, error);
  // Add your logging service here (e.g., Winston, Pino)
};

// Then in your email functions:
try {
  // ... your code
} catch (error) {
  logEmailError(error, "verification", email);
  throw new Error(`Email sending failed: ${error.message}`);
}
