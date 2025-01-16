import React, { useState } from "react";

const NotificationPreferences = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Notification Preferences</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Notifications</h2>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                        className="form-checkbox"
                    />
                    <span className="ml-2 text-gray-900 dark:text-white">Receive email notifications</span>
                </label>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Push Notifications</h2>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                        className="form-checkbox"
                    />
                    <span className="ml-2 text-gray-900 dark:text-white">Enable push notifications</span>
                </label>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Do Not Disturb Mode</h2>
                <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2 text-gray-900 dark:text-white">Enable Do Not Disturb (DND)</span>
                </label>
            </div>
        </div>
    );
};

export default NotificationPreferences;
