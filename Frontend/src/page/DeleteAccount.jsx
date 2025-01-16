import React, { useState } from "react";
import { deleteAccount } from "../services/api";
 

const DeleteAccount = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await  deleteAccount(password)
            setMessage(response.data.message); // Success message from backend
        } catch (error) {
            setMessage(error.response.data.message); // Error message from backend
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Delete Account</h1>
            <div className="mb-6">
                <p className="text-gray-700">
                    Deleting your account is permanent. You will lose all your data. Please type your password to confirm.
                </p>
            </div>
            <div className="mb-6">
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="border p-2 mb-2 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {message && <p className="text-center text-red-600">{message}</p>}
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={isDeleting}
            >
                {isDeleting ? "Deleting..." : "Delete My Account"}
            </button>
        </div>
    );
};

export default DeleteAccount;
