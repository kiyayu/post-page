import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { AuthContext } from "../context/AuthContext"; // Ensure the path is correct 
import { FaBell, FaCog, FaSun, FaMoon } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';
import { useTheme } from "../context/ThemeContext"; // Make sure to import the custom hook

const Navbar = () => {
  const { user, logout, notification } = useContext(AuthContext);
  const { theme, changeTheme } = useTheme(); // Use the custom hook for theme context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settingModal, setSettingModal] = useState(false);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    changeTheme(newTheme); // Toggle theme between light and dark
  };

  return (
    <div className="w-full h-[8vh] bg-green-700 fixed z-10 dark:bg-gray-800 dark:text-white">
      <div className="w-full h-full text-white flex items-center justify-between px-4">
        <div className="text-xl font-bold">
          <Link to="/">πράσινο</Link>
        </div>

        
        <button
          className="md:hidden flex items-center justify-center gap-3 text-white"
        >
          <Link to='notification'>
            <button
              className="px-5 flex items-center gap-2 py-1 rounded-lg relative"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-red-600"><FaBell /> </span>
              <span className="text-white font-bold font-serif absolute right-4 top-0">{notification.length}</span>
            </button>
          </Link>
 
          {/* Theme Toggle (Sun/Moon) */}
          <motion.button
            onClick={handleThemeToggle}
            className="relative p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-900 transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: theme === 'light' ? 0 : 180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              {theme === 'light' ? (
                <FaSun className="w-6 h-6 text-amber-500 transition-all duration-300" strokeWidth={2.5} />
              ) : (
                <FaMoon className="w-6 h-6 text-blue-200 transition-all duration-300" strokeWidth={2.5} />
              )}
            </motion.div>

            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 blur opacity-50 group-hover:opacity-75 transition-opacity duration-200" />
          </motion.button>

          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          {!user && ( 
        
            <motion.button
              onClick={handleThemeToggle}
              className="relative p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-900 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === 'light' ? 0 : 180 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative"
              >
                {theme === 'light' ? (
                  <FaSun className="w-6 h-6 text-amber-500 transition-all duration-300" strokeWidth={2.5} />
                ) : (
                  <FaMoon className="w-6 h-6 text-blue-200 transition-all duration-300" strokeWidth={2.5} />
                )}
              </motion.div>

              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 blur opacity-50 group-hover:opacity-75 transition-opacity duration-200" />
            </motion.button>
        )}

          {user ? (
            <>
              <Link to="/posttest">Post</Link>
              <Link to="/profile" className="flex items-center gap-2">
                <p>Hello, {user.name}</p>
                {user.profile && (
                  <img
                    src={user.profile}
                    className="w-6 h-6 rounded-full"
                    alt={user.name}
                  />
                )}
              </Link>
              <Link to='notification'>
                <button
                  className="px-5 flex items-center gap-2 py-1 rounded-lg relative"
                  onClick={() => { setIsMenuOpen(false) }}
                >
                  <span className="text-red-600"><FaBell /> </span>
                  <span className="text-white font-bold font-serif absolute right-4 top-0">{notification.length}</span>
                </button>
              </Link>
              <motion.button
                onClick={handleThemeToggle}
                className="relative p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-900 transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: theme === 'light' ? 0 : 180 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative"
                >
                  {theme === 'light' ? (
                    <FaSun className="w-6 h-6 text-amber-500 transition-all duration-300" strokeWidth={2.5} />
                  ) : (
                    <FaMoon className="w-6 h-6 text-blue-200 transition-all duration-300" strokeWidth={2.5} />
                  )}
                </motion.div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 blur opacity-50 group-hover:opacity-75 transition-opacity duration-200" />
              </motion.button>
              <div onClick={() => setSettingModal(!settingModal)} className="flex items-center">
                <motion.div
                  whileHover={{ rotate: 30 }}
                  style={{ transformOrigin: 'center' }}
                  className="w-fit inline-block"
                >
                  <FaCog className="text-2xl text-white" />
                </motion.div>
              </div>
              {settingModal && (
                <motion.div
                  initial={{ x: -10, scale: 0.9 }}
                  animate={{ x: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-[10vh] dark:bg-gray-800 dark:text-white border flex flex-col p-3 gap-4 items-center w-[200px] bg-green-400 rounded-lg right-3"
                >
                  <span
                    onClick={() => setSettingModal(!settingModal)}
                    className="absolute top-2 right-2 cursor-pointer"
                  >
                    x
                  </span>
                  <Link to='notification'>
                    <button
                      className="px-5 flex items-center gap-2 py-1 rounded-lg relative"
                      onClick={() => { setSettingModal(false) }}
                    >
                      <span className="text-gray-950"><FaBell /> </span>
                      <span className="text-red-500 font-bold font-serif absolute right-3 top-0">{notification.length}</span>
                    </button>
                  </Link>
                  {/* Settings links */}
                  <Link to="/profile-settings" onClick={() => setSettingModal(false)}>Profile Settings</Link>
                  <Link to="/notification-preferences" onClick={() => setSettingModal(false)}>Notification Preferences</Link>
                  <Link to="/privacy-settings" onClick={() => setSettingModal(false)}>Privacy Settings</Link>
                  <Link to="/theme-settings" onClick={() => setSettingModal(false)}>Theme Settings</Link>
                  <Link to="/account-security" onClick={() => setSettingModal(false)}>Account Security</Link>

                  <button
                    onClick={() => {
                      logout();
                      setSettingModal(false);
                    }}
                    className="border px-5 flex items-center gap-2 py-1 rounded-lg"
                  >
                    Logout <MdExitToApp className="text-red-500" />
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: '0' }}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="md:hidden w-52 fixed top-[8vh] dark:bg-gray-800 dark:text-white border right-0 flex flex-col bg-green-800 text-white gap-2 p-4"
        >
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>

          {user ? (
            <>
              <Link
                to="/posttest"
                onClick={() => setIsMenuOpen(false)}
              >
                Posttest
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <p>Hello, {user.name}</p>
                {user.profile && (
                  <img
                    src={user.profile}
                    className="w-6 h-6 rounded-full"
                    alt={user.name}
                  />
                )}
              </Link>
              <div onClick={() => { setSettingModal(!settingModal) }} className="flex items-center">
                <motion.div
                  whileHover={{ rotate: 30 }}
                  style={{ transformOrigin: 'center' }}
                  className="w-fit inline-block"
                >
                  <FaCog className="text-2xl text-white" />
                </motion.div>
              </div>
              {/* Settings modal in mobile */}
              {settingModal && (
                <motion.div
                  initial={{ x: -10, scale: 0.9 }}
                  animate={{ x: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col p-3  dark:bg-gray-800 dark:text-white  gap-4 items-center absolute right-[200px] w-[200px] bg-green-400 rounded-lg"
                >
                  <span
                    onClick={() => setSettingModal(!settingModal)}
                    className="absolute top-0 right-2 cursor-pointer"
                  >
                    x
                  </span>

                  {/* Settings Links */}
                  <Link to='notification'>
                    <button
                      className="px-5 flex items-center gap-2 py-1 rounded-lg relative"
                      onClick={() => { setSettingModal(false); setIsMenuOpen(false); }}
                    >
                      <span className="text-red-600"><FaBell /> </span>
                      <span className="text-white font-bold font-serif absolute right-4 top-0">{notification.length}</span>
                    </button>
                  </Link>
                  <Link to="/profile-settings" onClick={() => setSettingModal(false)}>Profile Settings</Link>
                  <Link to="/notification-preferences" onClick={() => setSettingModal(false)}>Notification Preferences</Link>
                  <Link to="/privacy-settings" onClick={() => setSettingModal(false)}>Privacy Settings</Link>
                  <Link to="/theme-settings" onClick={() => setSettingModal(false)}>Theme Settings</Link>
                  <Link to="/account-security" onClick={() => setSettingModal(false)}>Account Security</Link>

                  <button
                    onClick={() => {
                      logout();
                      setSettingModal(false);
                      setIsMenuOpen(false);
                    }}
                    className="border px-5 flex items-center gap-2 py-1 dark:bg-gray-800 dark:text-white rounded-lg"
                  >
                    Logout <MdExitToApp className="text-red-500" />
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
        </motion.div>
      )}
      
    </div>
  );
};

export default Navbar;
