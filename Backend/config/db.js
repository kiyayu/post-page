// config/ db.js
import mongoose from "mongoose";
import { environment } from "./environment.js";
/**
 * connect to MongoDB database.
 * @async
 * @returns {Promise<void>} Resolves when connection is successful.
 * @throws will throw  an error if connection fails.
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(environment.database.uri );
    console.log("Databse connected successfully");
  } catch (error) {
    console.error("Database connection faild:", error.message);
    process.exit(1);
  }
};
 