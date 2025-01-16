import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { environment } from "../config/environment.js";

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: environment.cloudinary.cloud_name,
  api_key: environment.cloudinary.api_key,
  api_secret: environment.cloudinary.api_secret,
});

// Configure Cloudinary and Multer 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "post_images",
    allowed_formats: ["jpeg", "png", "jpg"],
   
  },
});


const upload = multer({ storage });
// Configure Multer

export default upload;
