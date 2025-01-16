import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, resendVerificationEmail } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendEmailLoading, setResendEmailLoading] = useState(false); // For resend email
  const navigate = useNavigate();
  const {authLogin} = useContext(AuthContext)

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.password) {
      setError("Please fill in all fields.");
      setSuccess(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await login(formData);
       const token = response.data.token
       authLogin(token)
       localStorage.setItem('authToken', token)
       

      setSuccess("Login successful! Redirecting...");
      setFormData({ name: "", password: "" });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (
        error.response?.data?.message ===
        "Please verify your email before logging in."
      ) {
        setError(
          "Email not verified. Please check your inbox or resend the verification email below."
        );
      } else {
        setError("Invalid credentials or something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      setResendEmailLoading(true);
      await resendVerificationEmail({ email: formData.name });
      setSuccess("Verification email resent. Check your inbox!");
    } catch (error) {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setResendEmailLoading(false);
    }
  };

  return (
    <div className="w-full h-screen  dark:bg-gray-800 dark:text-white bg-slate-900 flex items-center justify-center">
      <div className="container mx-auto bg-white max-w-md p-6 rounded-lg shadow-2xl dark:bg-gray-800  dark:text-white ">
        <h1 className="text-center text-2xl font-bold text-gray-700 mb-4 dark:text-white">
          Welcome Back!
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-semibold  mb-1 dark:bg-gray-800 dark:text-white">
              Name (Email)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInput}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter your name (email)"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-gray-700 font-semibold mb-1 dark:bg-gray-800 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2  focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            className={`w-full dark:bg-gray-800 dark:text-white dark:border text-white py-2 rounded-md transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Forgot your password?{" "}
          <a href="/forgot-password" className="text-blue-500 underline dark:text-white">
            Reset it here.
          </a>
        </p>
        {error && (
          <div className="mt-4">
            <p className="text-center text-gray-600">
              Didn’t receive the email?{" "}
              <button
                className="text-blue-500 underline"
                onClick={handleResendVerificationEmail}
                disabled={resendEmailLoading}
              >
                {resendEmailLoading
                  ? "Resending..."
                  : "Resend Verification Email"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
