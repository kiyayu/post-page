import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Button2 } from '../components/Button';
import { FaBook, FaUser, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ErrorBoundary from '../components/ErrorBoundary';
import SEOHead from '../components/SEOHead';
import SkeletonLoader from '../components/SkeletonLoader';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
        <SEOHead
          title="Welcome to Our Community"
          description="Join our growing community to explore amazing posts and connect with others."
          keywords="community, posts, connection, social"
        />

   

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg text-gray-700 dark:text-gray-100 border shadow-lg text-center py-20 px-4 md:py-32"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-100 dark:to-gray-300"
            >
              Welcome to Our Community!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              We're excited to have you. Explore amazing posts and connect with others in our growing community.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to="/register" aria-label="Get Started with registration">
                <Button text='Get Started' />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-gray-100"
            >
              What We Offer
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: <FaBook className="w-8 h-8 text-green-600" />,
                  title: "Explore Posts",
                  description: "Discover thought-provoking posts and engage with a community of like-minded individuals.",
                  link: "/posttest",
                  buttonText: "Explore Posts",
                  bgColor: "bg-green-100 dark:bg-green-900"
                },
                {
                  icon: <FaUser className="w-8 h-8 text-blue-600" />,
                  title: "Your Profile",
                  description: "Customize your profile, track your activities, and manage your personal space.",
                  link: "/profile",
                  buttonText: "Go to Profile",
                  bgColor: "bg-blue-100 dark:bg-blue-900"
                },
                {
                  icon: <FaEnvelope className="w-8 h-8 text-purple-600" />,
                  title: "Contact Us",
                  description: "Need help? Our support team is always here to assist you.",
                  link: "/contact",
                  buttonText: "Contact Us",
                  bgColor: "bg-purple-100 dark:bg-purple-900"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                >
                  <div className={`flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-full mb-6 mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-center dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                    {feature.description}
                  </p>
                  <div className="text-center">
                    <Link to={feature.link} aria-label={`Navigate to ${feature.title}`}>
                      <Button2 text={feature.buttonText} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-10 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-lg">&copy; 2025 πράσινο All Rights Reserved.</p>
              </div>
              <nav className="flex gap-6">
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white transition duration-300"
                  aria-label="Privacy Policy"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition duration-300"
                  aria-label="Terms of Service"
                >
                  Terms of Service
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default Home;