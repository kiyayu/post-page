import React from "react";

const AccountSecurity = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full h-screen dark:bg-gray-800 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Account Security</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
                <p className="text-gray-700 dark:bg-gray-800 dark:text-white">Enhance your account security by enabling 2FA.</p>
                <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded dark:bg-gray-800 dark:text-white border">
                    Enable 2FA
                </button>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <form>
                    <input type="password" placeholder="Old Password" className="dark:bg-gray-800 dark:text-white border p-2 mb-2 w-full" />
                    <input type="password" placeholder="New Password" className="dark:bg-gray-800 dark:text-white border p-2 mb-2 w-full" />
                    <input type="password" placeholder="Confirm Password" className="dark:bg-gray-800 dark:text-white border p-2 mb-2 w-full" />
                    <button type="submit" className="bg-green-500 border  text-white px-4 py-2 rounded dark:bg-gray-800 dark:text-white">
                        Change Password
                    </button>
                </form>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Login History</h2>
                <ul>
                    <li className="text-gray-700 dark:bg-gray-800 dark:text-white">Device 1 - 192.168.0.1 - 01/01/2025</li>
                    <li className="text-gray-700 dark:bg-gray-800 dark:text-white">Device 2 - 192.168.0.2 - 01/02/2025</li>
                </ul>
                <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                    Log Out of All Devices
                </button>
            </div>
        </div>
    );
};

export default AccountSecurity;
