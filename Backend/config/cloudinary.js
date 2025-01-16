import cloudinary from "cloudinary";
import { environment } from "./environment.js";

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: environment.cloudinary.cloud_name,
  api_key: environment.cloudinary.api_key,
  api_secret: environment.cloudinary.api_secret,
});

/**
 * Upload an image to Cloudinary directly from memory.
 * @param {Buffer} fileBuffer - File buffer.
 * @param {string} folder - Folder name in Cloudinary.
 * @param {object} options - Additional upload options.
 * @returns {Promise<object>} Upload result from Cloudinary
 */
export const uploadImage = async (fileBuffer, folder, options = {}) => {
  try {
    const result = await cloudinary.v2.uploader
      .upload_stream({ folder, ...options }, (error, uploadResult) => {
        if (error) throw error;
        return uploadResult;
      })
      .end(fileBuffer); // Pipe the buffer
    return result;
  } catch (error) {
    throw new Error(`Cloudinary Upload Error: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary.
 * @param {string} publicId - Public ID of the image to delete.
 * @returns {Promise<object>} Deletion result from Cloudinary.
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary Delete Error: ${error.message}`);
  }
};
  