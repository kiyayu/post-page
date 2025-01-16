// utils/rateLimiter.js
import rateLimit from "express-rate-limit";

// utils/rateLimiter.js
const emailRequestLog = new Map();

export const emailRateLimiter = {
  checkLimit(email) {
    const currentTime = Date.now();
    const windowTime = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5;

    if (!emailRequestLog.has(email)) {
      emailRequestLog.set(email, []);
    }

    const timestamps = emailRequestLog.get(email);

    // Remove timestamps older than the window
    while (timestamps.length && timestamps[0] < currentTime - windowTime) {
      timestamps.shift();
    }

    if (timestamps.length >= maxRequests) {
      throw new Error("Too many email requests, please try again later.");
    }

    // Log the current request timestamp
    timestamps.push(currentTime);
  },
};
