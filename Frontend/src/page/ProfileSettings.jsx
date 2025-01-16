// src/pages/ProfileSettings.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
 

const ProfileSettings = () => {
 

    return (<div className="w-full dark:bg-gray-800 dark:text-white ">
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-800 dark:text-white">
            <h1 className="text-3xl font-semibold mb-6">Profile Settings</h1>

            {/* Profile Information */}
            <div className="mb-6">
                <h2 className="text-xl font-medium">Personal Information</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium dark:bg-gray-800 dark:text-white">Username</label>
                        <input
                            type="text"
                            className="w-full p-2 mt-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
                            placeholder="Enter new username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium dark:bg-gray-800 dark:text-white">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 mt-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
                            placeholder="Enter new email address"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium dark:bg-gray-800 dark:text-white">Phone Number</label>
                        <input
                            type="text"
                            className="w-full p-2 mt-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <button className="bg-blue-500 text-white p-2 rounded dark:bg-gray-800 dark:text-white">Update Profile</button>
                </form>
            </div>

           

            {/* Additional Options */}
            <div className="mb-6">
                <Link to="/forgot-password" className="block mb-2 text-blue-600 dark:bg-gray-800 dark:text-white">
                   Reset Password
                </Link>
                <Link to="/notification-preferences" className="block mb-2 text-blue-600 dark:bg-gray-800 dark:text-white">
                    Notification Preferences
                </Link>
                <Link to="/privacy-settings" className="block mb-2 text-blue-600 dark:bg-gray-800 dark:text-white">
                    Privacy Settings
                </Link>
                <Link to="/theme-settings" className="block mb-2 text-blue-600 dark:bg-gray-800 dark:text-white">
                    Theme Settings
                </Link>
                <Link to="/account-security" className="block mb-2 text-blue-600 dark:bg-gray-800 dark:text-white">
                    Account Security
                </Link>
                <Link to="/delete-account" onClick={() => setSetingModal(false)} className="text-red-600">
                  Delete Account
                </Link>
            </div>

            {/* Reset Password Modal */}
      
        </div>
        </div>
    );
};

export default ProfileSettings;
