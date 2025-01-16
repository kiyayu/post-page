import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { MdMonitor } from 'react-icons/md';
import { FaMoon, FaSun , } from 'react-icons/fa';

const ThemeSettings = () => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className="   py-8 dark:bg-gray-800 dark:text-white h-screen w-full">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Theme Settings
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => changeTheme('light')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                            ${theme === 'light'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                : 'border-gray-200 dark:border-gray-700'}`}
                    >
                        <FaSun className="w-5 h-5" />
                        <span>Light</span>
                    </button>

                    <button
                        onClick={() => changeTheme('dark')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                            ${theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                : 'border-gray-200 dark:border-gray-700'}`}
                    >
                        <FaMoon className="w-5 h-5" />
                        <span>Dark</span>
                    </button>

                    <button
                        onClick={() => changeTheme('system')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                            ${theme === 'system'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                : 'border-gray-200 dark:border-gray-700'}`}
                    >
                        <MdMonitor className="w-5 h-5" />
                        <span>System</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettings;