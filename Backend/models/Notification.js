// models/Notification.js
import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  file: { type: String, required: false },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notificationType: {
    type: String,
    required: true,
    enum: ["new_post", "liked", "commented"],
  },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

 const Notification = mongoose.model("Notification", notificationSchema);
  export default Notification;
