import cors from "cors";
import express from "express"; 
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
 

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
app.use(
  cors()
);

// Connect to Database
connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

 
 

export default app;
