import React, { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    coniformPassword:"",
    profile: null,
  });
  const navigate = useNavigate();
const [loading, setLoading] = useState(false); // State for loading
const [disabled, setDisabled] = useState(false); // State for disabled

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "profile" ? files[0] : value,
    }));
  };
const getDomain = (email) => {
  const parts = email.split("@"); // Split email by '@'
  if (parts.length === 2) {
    return parts[1]; // Return the domain (part after '@')
  }
  return ""; // If no '@' is present, return an empty string
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.coniformPassword) {
      toast.error("The passwords do not match.");
      return;
    }

    // Additional password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    // Basic email validation (more robust on backend)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    // File validation (limit profile image size to 2MB)
    if (formData.profile && formData.profile.size > 2 * 1024 * 1024) {
      toast.error("Profile image size should not exceed 2MB.");
      return;
    }

    const Domain = getDomain(formData.email);
    const formdataToSend = new FormData();
    formdataToSend.append("name", formData.name);
    formdataToSend.append("email", formData.email);
    formdataToSend.append("password", formData.password);
    formdataToSend.append("profile", formData.profile);

    try {
      setLoading(true);
      const response = await register(formdataToSend);
      toast.success(
        `Registration successful! Check your inbox to verify your email.${Domain}`
      );

      // Clear form data after successful registration
      setFormData({
        name: "",
        email: "", 
        password: "",
        coniformPassword: "",
        profile: null,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full min-h-screen  dark:bg-gray-800 dark:text-white bg-slate-900 ">
      <h1 className="text-center text-2xl font-bold text-white py-6">
        Lorem, ipsum dolor!
      </h1>
      <div className="container mx-auto">
        <form
          onSubmit={handleSubmit}  
          className="max-w-md mx-auto bg-white p-6  dark:bg-gray-800 dark:text-white rounded-lg shadow-md space-y-4"
        >
          <div className="flex flex-col  dark:bg-gray-800 dark:text-white">
            <label className="text-gray-700 mb-2  dark:bg-gray-800 dark:text-white">
              Name:
              <input
                className="  dark:bg-gray-800 dark:text-white w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInput}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className=" dark:bg-gray-800 dark:text-white text-gray-700 mb-2">
              Email:
              <input
                className="w-full mt-1  dark:bg-gray-800 dark:text-white px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInput}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className=" dark:bg-gray-800 dark:text-white text-gray-700 mb-2">
              Password:
              <input
                className="w-full  dark:bg-gray-800 dark:text-white mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInput}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className=" dark:bg-gray-800 dark:text-white text-gray-700 mb-2">
              Conform Password:
              <input
                className="w-full  dark:bg-gray-800 dark:text-white mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="coniformPassword"
                placeholder="Password"
                value={formData.coniformPassword}
                onChange={handleInput}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className=" dark:file-bg-gray-800 dark:text-white text-gray-700 mb-2">
              Profile:
              <input
                className="w-full mt-1 file:mr-4 file:py-2 file:px-4    file:bg-blue-500   dark:file:bg-gray-800 file:text-white file:rounded-md    "
                type="file"
                name="profile"
                onChange={handleInput}
              />
            </label>
          </div>
          <button
            className={`w-full text-white py-2  dark:bg-gray-800 dark:text-white dark:border rounded-md transition-color ${
              loading
              ? "bg-blue-400 hover:bg-blue-500 cursor-not-allowed  dark:bg-gray-800 dark:text-white"
              : "bg-blue-500 hover:bg-blue-600  dark:bg-gray-800 dark:text-white"
            }`}
            type="submit"
            disabled={loading || disabled} // Disable when loading or explicitly disabled
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className=" dark:bg-gray-800 dark:text-white animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
