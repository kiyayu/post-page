import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import the useTheme hook

const ThemeToggle = () => {
    const { theme, changeTheme } = useTheme(); // Get current theme and changeTheme function

    // Function to toggle themes
    const handleThemeChange = (newTheme) => {
        changeTheme(newTheme); // Change the theme based on button click
    };

    return (
        <div className="dark:bg-gray-800 dark:text-white w-full h-screen">
        <div className="flex gap-4 dark:bg-gray-800 dark:text-white">
            <button
                onClick={() => handleThemeChange("light")}
                className={`px-4 py-2 rounded ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
                Light Mode
            </button>
            <button
                onClick={() => handleThemeChange("dark")}
                className={`px-4 py-2 rounded ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
                Dark Mode
            </button>
            <button
                onClick={() => handleThemeChange("system")}
                className={`px-4 py-2 rounded ${theme === "system" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
                System Default
            </button>
        </div>
        </div>
    );
};

export default ThemeToggle;
