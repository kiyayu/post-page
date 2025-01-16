import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Correct import
import axios from "axios";
import { getNotification } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([])
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to extract the user ID
        fetchUser(decoded.id); // Fetch user details using the ID
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); // Clear invalid token
      }
    }
  }, []);

  const fetchUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${id}`);
      setUser(response.data); // Set user details
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const authLogin = (token) =>{
    const decode = jwtDecode(token)
    fetchUser(decode.id)
  }

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null); // Clear user data on logout
  };
  const notifications = async () =>{
    try{
      const response = await getNotification()
      setNotification(response.data)
    }
    catch (error) {
      console.error("error", error)
    }
  }
  useEffect(() =>{
    notifications()

  },[])
  return (
    <AuthContext.Provider value={{ user, logout , authLogin, notification}}>
      {children}
    </AuthContext.Provider>
  );
};
