import express from 'express'
import upload from '../middleware/profileUpload.js'
import {userRegister, userLogin, AllUserProfile, userById, deleteAccount, getUserById, getVerificationEmail, resendVerification, resetPassword, getResetPassword, postResetPassword, updateProfile,contactEmail} from '../controllers/userControl.js'
import { getCategories } from '../controllers/categoriesController.js'
 const router = express.Router()
import { auth } from '../middleware/auth.js'

// user routes

router.post('/user/register', upload.single('profile'), userRegister)
router.post("/user/login", userLogin)
router.get("/user/all", AllUserProfile)
router.get("/user/profile",auth, userById)
router.put("/user/update", upload.single("profile"), auth, updateProfile);
router.get("/verify-email/:token", getVerificationEmail);
router.post("/user/resend-verification", resendVerification)
router.post("/user/request-password-reset", resetPassword)
router.get("/reset-password/:token", getResetPassword)
router.post("/user/reset-password/:token", postResetPassword)
router.post("/contact", contactEmail )
router.get("/user/:id", getUserById)
router.get("/categories",  auth, getCategories)
router.get("/delete/account", auth, deleteAccount)
export default router
