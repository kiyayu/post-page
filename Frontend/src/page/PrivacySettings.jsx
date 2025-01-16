import React, { useState } from "react";

const PrivacySettings = () => {
    const [profileVisibility, setProfileVisibility] = useState("public");
    const [activityStatus, setActivityStatus] = useState(true);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md h-screen dark:bg-gray-800 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Privacy Settings</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Profile Visibility</h2>
                <select
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                    className="border p-2 w-full dark:bg-gray-800 dark:text-white"
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Activity Status</h2>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={activityStatus}
                        onChange={() => setActivityStatus(!activityStatus)}
                        className="form-checkbox dark:bg-gray-800 dark:text-white"
                    />
                    <span className="ml-2">Show last active status</span>
                </label>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Block Users</h2>
                <ul>
                   
                </ul>
                <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                    Unblock All
                </button>
            </div>
        </div>
    );
};

export default PrivacySettings;
