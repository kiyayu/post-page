import React, { useState } from "react";
import { requestPasswordReset } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Sending request with email:", email);
    const response = await requestPasswordReset({ email });
    console.log("API Response:", response.data);
    setMessage("Check your email for password reset instructions.");
  } catch (error) {
    console.error("API Error:", error.response || error.message);
    setMessage("Error: Unable to process your request.");
  }
};


  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
      <div className="container mx-auto bg-white max-w-md p-6 rounded-lg shadow-2xl">
        <h1 className="text-center text-2xl font-bold text-gray-700 mb-4">
          Reset Password
        </h1>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            type="submit"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
