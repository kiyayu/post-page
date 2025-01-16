import twilio from "twilio";
import { environment } from "../config/environment.js"; // Store your Twilio credentials in the environment

// Initialize Twilio client with account SID and Auth Token
const client = twilio(
  environment.twilio.accountSid,
  environment.twilio.authToken
);

// Send phone verification code
export const sendPhoneVerificationCode = async (phoneNumber) => {
  // Generate a random 6-digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    // Send the SMS with the verification code using Twilio
    await client.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: environment.twilio.phoneNumber, // Twilio phone number
      to: phoneNumber,
    });

    // Return the verification code (store this in DB or Redis in production)
    return verificationCode;
  } catch (error) {
    console.error("Phone verification error:", error);
    throw new Error("Failed to send phone verification code.");
  }
};
