//config/environment.js
import dotenv from 'dotenv'
dotenv.config();

/**
 * Environment-specific configurations for the application
 */
export const environment = {
  server: {
    port: process.env.PORT || 5000,
    mode: process.env.NODE_ENV || "development",
    baseUrl: "https://post-page-rzna.onrender.com" // "http://localhost:5173",
  },

  database: {
    uri: process.env.MONGO_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  cloudinary: {
    cloud_name: "dfmujwmjp",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  resend: {
    api_key: process.env.RESEND_API_KEY,
    from_email: process.env.RESEND_FROM_EMAIL,
  },

  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    recipient_email: process.env.RECIPIENT_EMAIL,
  },
};

