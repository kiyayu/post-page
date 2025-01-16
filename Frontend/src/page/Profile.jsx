import React, { useState, useEffect } from "react";
import { userProfile, updateProfile } from "../services/api";
import { motion } from "framer-motion";
import { FiEdit2, FiUser, FiMail, FiCamera, FiCheck, FiX } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const [reload, setReload] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userProfile();
        setUser(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          profile: null,
        });
        setPreview(response.data.profile || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reload]);

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.profile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("profile", formData.profile);
        formDataWithFile.append("name", formData.name);
        formDataWithFile.append("email", formData.email);

        const response = await updateProfile(formDataWithFile);
        setUser(response.data);
      } else {
        const response = await updateProfile(updateData);
        setUser(response.data);
      }

      setSuccess(true);
      setEditing(false);
      setReload(!reload);
    } catch (err) {
      setError("Error updating profile. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <motion.div
        className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
        
    
      />
      
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          className="p-4 bg-red-100 text-red-600 rounded-lg shadow-lg"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 dark:bg-green-900 p-4"
          >
            <span className="flex items-center text-green-700 dark:text-green-100">
              <FiCheck className="w-5 h-5 mr-2 text-green-500" />
              Profile updated successfully!
            </span>
          </motion.div>
        )}

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profile
            </h1>
            <div className="h-1 w-20 bg-green-200 mx-auto rounded-full" />
          </div>

          {user && !editing ? (
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              className="space-y-6"
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  {user.profile ? (
                    <img
                      src={user.profile}
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-green-500 ring-offset-4"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FiUser className="w-12 h-12 text-green-500" />
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2 text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <FiMail className="w-5 h-5 mr-2 text-green-500" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="w-full mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
              >
                <span className="flex items-center justify-center">
                  <FiEdit2 className="w-5 h-5 mr-2 text-white" />
                  <span className="font-medium">Edit Profile</span>
                </span>
              </motion.button>
            </motion.div>
          ) : editing ? (
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              className="space-y-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-green-500 ring-offset-4"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <HiOutlinePhotograph className="w-12 h-12 text-green-500" />
                      </div>
                    )}
                    <label
                      htmlFor="profile"
                      className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
                    >
                      <FiCamera className="text-white w-5 h-5" />
                      <input
                        type="file"
                        id="profile"
                        name="profile"
                        onChange={handleInput}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInput}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInput}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center justify-center">
                        <FiCheck className="w-5 h-5 mr-2 text-white" />
                        <span className="font-medium">Save Changes</span>
                      </span>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center">
                      <FiX className="w-5 h-5 mr-2 text-green-500" />
                      <span className="font-medium">Cancel</span>
                    </span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No user data available
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;