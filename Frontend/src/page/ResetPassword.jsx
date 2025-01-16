import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword( token, password );
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Error: Unable to reset password.");
    }
  };

  return (
    <div className="w-full h-screen bg-slate-900 dark:bg-gray-800 dark:text-white flex items-center justify-center">
      <div className="container mx-auto bg-white max-w-md p-6 rounded-lg shadow-2xl">
        <h1 className="text-center text-2xl font-bold text-gray-700 mb-4">
          Reset Password
        </h1>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-gray-700 font-semibold mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
