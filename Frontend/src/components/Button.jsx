// components/Button.js
import React from 'react';

export const Button = ({ text }) => {
    return (
        <div className="relative flex justify-center items-center">
            <button className="relative flex justify-center items-center text-gray-800 dark:text-gray-100 shadow-gray-500 hover:text-white font-montserrat font-bold text-lg tracking-[0.2em] py-4 px-6 rounded shadow-md overflow-hidden cursor-pointer border-none transition-all duration-100 ease-in-out group">
                <span className="relative z-10 transition-all duration-300 ease-in-out">
                    {text}
                </span>
                <div className="absolute inset-0 bg-green-700 dark:bg-green-600 w-0 h-full transition-all duration-400 ease-in-out group-hover:w-full"></div>
            </button>
        </div>
    );
};

export const Button2 = ({ text }) => {
    return (
        <div className="relative flex items-center">
            <button className="relative flex justify-center items-center font-serif tracking-widest py-2 px-4 rounded shadow-md overflow-hidden cursor-pointer border border-gray-400 dark:border-gray-600 transition-all duration-300 ease-in-out group">
                <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-white dark:text-gray-100">
                    {text}
                </span>
                <div className="absolute inset-0 bg-green-700 dark:bg-green-600 w-0 h-full transition-all duration-400 ease-in-out group-hover:w-full"></div>
            </button>
        </div>
    );
};