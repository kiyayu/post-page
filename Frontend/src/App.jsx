import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './page/Home';
import Profile from './page/Profile';
import Contact from './page/Contact';
import Login from './page/Login';
import Register from './page/Register';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import EmailVerification from './page/EmailVerification';
import PostsList from './Post/posttest';
import Notification from './components/Notification';
import NotificationPreferences from './page/NotificationPreferences';
import PrivacySettings from './page/PrivacySettings';
import ThemeSettings from './page/ThemeSettings';
import AccountSecurity from './page/AccountSecurity';
import DeleteAccount from './page/DeleteAccount';
import ProfileSettings from './page/ProfileSettings'; 
const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen  ">
      <div className="transition-colors duration-200 min-h-screen ">
        {children}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <PageWrapper>
            <Navbar />
            <main className="pt-[8vh] min-h-[92vh]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/posttest" element={<PostsList />} />
                <Route path='notification' element={<Notification />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/post" element={<Post />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/notification-preferences" element={<NotificationPreferences />} />
                <Route path="/privacy-settings" element={<PrivacySettings />} />
                <Route path="/theme-settings" element={<ThemeSettings />} />
                <Route path="/account-security" element={<AccountSecurity />} />
                <Route path="/delete-account" element={<DeleteAccount />} />
                <Route path="/verify-email/:token" element={<EmailVerification />} />
              </Routes>
            </main>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
              theme="colored"
            />
          </PageWrapper>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}