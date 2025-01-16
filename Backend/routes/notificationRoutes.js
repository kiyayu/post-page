import express from 'express'
import { deleteNotification, getNotification, markNotificationAsRead } from '../controllers/notificationController.js'
import { auth } from '../middleware/auth.js'
const router = express.Router()

// notification routes
router.get("/notification/get", auth, getNotification)
router.put("/notification/:id/red", auth, markNotificationAsRead)
router.delete("/notification/:id", auth, deleteNotification)

export default router