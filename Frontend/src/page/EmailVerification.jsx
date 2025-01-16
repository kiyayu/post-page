import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";
import { toast } from "react-toastify";

const EmailVerification = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();
console.log(token)
  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setMessage("Email verified successfully!");
        setTimeout(() => {
          toast.success("Email verified successfully! Redirecting to login...");
          navigate("/login");
        }, 1500);
      } catch (error) {
        setMessage("Email verification failed");
        toast.error(
          "Email verification failed. The link may be invalid or expired."
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4">{message}</h1>
      </div>
    </div>
  );
};

export default EmailVerification;
