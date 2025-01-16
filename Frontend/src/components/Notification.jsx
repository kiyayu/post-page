import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getNotification, markNotificationAsRead } from "../services/api"; // Assume these API methods exist
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Notification = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    console.log(notifications)

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await getNotification(user._id); // Fetch user-specific notifications
            setNotifications(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Notification Error", error);
            setIsLoading(false);
            toast.error("Failed to fetch notifications");
        }
    };

    // Mark notification as read and navigate to the post
    const handleNotificationClick = async (notification) => {
        try {
            await markNotificationAsRead(notification._id); // Mark notification as read
            setNotifications((prev) =>
                prev.filter((not) => not._id !== notification._id)
            ); // Remove from UI after marking as read
            navigate("/posttest", { state: { postId: notification.postId } });
        } catch (error) {
            console.error("Error marking notification as read", error);
            toast.error("Failed to mark notification as read");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="w-8 h-8 border-4 bg-green-700 border-gray-200 border-t-transparent rounded-full cursor-none animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex w-full p-4 dark:bg-gray-800 dark:text-white h-screen">
            <div>
                <h1 className="text-lg font-bold mb-4">Notifications</h1>
                <div>
                    {notifications.length > 0 ? (
                        notifications.map((not) => (
                            <div
                                key={not._id}
                                className="p-4 dark:bg-gray-800 dark:text-white border rounded-md shadow-md mb-4 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNotificationClick(not)}
                            >
                                <div className="flex items-center mb-2">
                                    <img
                                        src={not.author.profile}
                                        alt="Author Profile"
                                        className="h-8 w-8 rounded-full border border-green-600 mr-3"
                                    />
                                    <p className="text-gray-800 dark:bg-gray-800 dark:text-white font-medium">{not.author.name}</p>
                                </div>
                                <p className="text-gray-900 font-bold mb-2 dark:bg-gray-800 dark:text-white">{not.title}</p>
                                {not.file && (
                                    <img
                                        src={not.file}
                                        alt="Attached File"
                                        className="object-cover w-20 h-24"
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                            <p className="text-gray-600 dark:bg-gray-800 dark:text-white">No Notifications Yet!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notification;
