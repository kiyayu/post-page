import React, { useState } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "", // 'success' | 'error' | 'loading'
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending..." });

    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setStatus({ type: "success", message: "Message Sent!" });
      toast.success("Message Sent!")
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: "Error sending message" });
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 dark:text-white py-12 px-8 sm:px-10 lg:px-8">
      <ContactForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        status={status}
      />
    </div>
  );
};

export default Contact;



// Mobile social links for smaller screens
const MobileSocialLinks = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="md:hidden w-full dark:bg-gray-800 dark:text-white  overflow-x-auto px-4 py-2"
  >
    <div className="flex flex-nowrap dark:bg-gray-800 dark:text-white  justify-start gap-3 min-w-max mx-auto">
      <SocialLink
        icon={<FaFacebook />}
        link="https://facebook.com"
        className="flex-shrink-0 " // Prevents icon shrinking
      />
      <SocialLink
        icon={<FaTwitter />}
        link="https://twitter.com"
        className="flex-shrink-0"
      />
      <SocialLink
        icon={<FaInstagram />}
        link="https://instagram.com"
        className="flex-shrink-0"
      />
      <SocialLink
        icon={<FaLinkedin />}
        link="https://linkedin.com"
        className="flex-shrink-0"
      />
      <SocialLink
        icon={<FaGithub />}
        link="https://github.com"
        className="flex-shrink-0"
      />
    </div>
  </motion.div>
);

// Update the SocialLink component to accept and use className prop
const SocialLink = ({ icon, link, className = "" }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.95 }}
    className={`relative group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
    <div className="relative  dark:bg-gray-800 dark:text-white p-2 sm:p-3 text-purple-600 bg-opacity-10 backdrop-blur-lg rounded-full border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition duration-300">
      <span className="text-base sm:text-lg text-white  group-hover:text-blue-700 transition duration-300">
        {icon}
      </span>
    </div>
  </motion.a>
);
// Replace the existing social links container with this:
const SocialLinksContainer = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, staggerChildren: 0.1 }}
    className="hidden md:flex fixed md:right-4 lg:right-10 top-1/2 -translate-y-1/2   flex-col gap-3 md:gap-4 lg:gap-6 z-50"
  >
    <SocialLink icon={<FaFacebook />} link="https://facebook.com" />
    <SocialLink icon={<FaTwitter />} link="https://twitter.com" />
    <SocialLink icon={<FaInstagram />} link="https://instagram.com" />
    <SocialLink icon={<FaLinkedin />} link="https://linkedin.com" />
    <SocialLink icon={<FaGithub />} link="https://github.com" />
  </motion.div>
);

 
const ContactForm = ({ formData, handleChange, handleSubmit, status }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12 dark:bg-gray-800 dark:text-white">
        <h2 className="text-3xl font-bold text-gray-900  dark:text-white sm:text-4xl mb-4">
          Get in Touch
        </h2>
        <p className="text-lg text-gray-600   dark:text-white max-w-2xl mx-auto">
          Have a question or want to work together? We'd love to hear from you.
        </p>
      </div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 dark:bg-gray-800">
        <ContactInfoCard
          icon={<PhoneIcon />}
          title="Phone"
          content="+251 (094) 1232-1767"
        />
        <ContactInfoCard
          icon={<EmailIcon />}
          title="Email"
          content="tarikufirdu@gamil.com"
        />
        <ContactInfoCard
          icon={<LocationIcon />}
          title="Location"
          content="Ethiopia Addis Ababa"
        />  
        
      </div>
      <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 flex flex-col gap-6"
        >
          <SocialLink icon={<FaFacebook />} link="https://facebook.com" />
          <SocialLink icon={<FaTwitter />} link="https://twitter.com" />
          <SocialLink icon={<FaInstagram />} link="https://instagram.com" />
          <SocialLink icon={<FaLinkedin />} link="https://linkedin.com" />
          <SocialLink icon={<FaGithub />} link="https://github.com" />
        </motion.div>
      
      

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <FormField
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2 dark:bg-gray-800 dark:text-white"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-lg border dark:bg-gray-800 dark:text-white border-gray-300 px-4 py-3 
                          text-gray-900 placeholder-gray-500 focus:border-blue-500 
                          focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                          transition duration-200"
                placeholder="Your message..."
              />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="inline-flex items-center justify-center px-6 py-3 
                         border border-transparent rounded-lg text-base font-medium 
                         text-white bg-green-600 hover:bg-gray-700 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition duration-200 dark:bg-gray-800 dark:text-white dark:border dark:border-white"
              >
                {status.type === "loading" ? (
                  <>
                    <LoadingSpinner />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>

          {status.message && (
            <div
              className={`mt-6 p-4 rounded-lg ${status.type === "success"
                  ? "bg-green-50 text-green-800"
                  : status.type === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-blue-50 text-blue-800"
                }`}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, name, type, value, onChange, required }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-2 dark:bg-gray-800 dark:text-white"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-lg border border-gray-300 px-4 py-3 
                text-gray-900 placeholder-gray-500 focus:border-blue-500 
                focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                transition duration-200 dark:bg-gray-800 dark:text-white"
    />
  </div>
);

const ContactInfoCard = ({ icon, title, content }) => (
  <div className="flex items-center p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
    <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg  text-green-600 dark:bg-gray-800 dark:text-white">
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-medium text-gray-900 dark:bg-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:bg-gray-800 dark:text-white">{content}</p>
    </div>
  </div>
);
{/* Social Links - Desktop */ }
<SocialLinksContainer />

{/* Social Links - Mobile */ }
<MobileSocialLinks />
const PhoneIcon = () => (
  <svg
    className="h-6 w-6  "
     
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h2m4 0h8m2 0h2m-2-4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h14z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a1 1 0 001.22 0L21 8m0 8a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657l-1.414 1.414L12 14.828l-4.243 4.243-1.414-1.414L10.172 12 6.93 8.757l1.414-1.414L12 9.172l4.243-4.243 1.414 1.414L13.828 12l3.829 3.829z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4h4a8 8 0 01-8 8v-4z"
    />
  </svg>

);
 