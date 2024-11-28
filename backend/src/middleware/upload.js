const multer = require('multer'); // Import multer
const cloudinary = require('cloudinary').v2;  // Import Cloudinary

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage configuration
const storage = multer.memoryStorage();

// Initialize multer middleware for handling file uploads
const upload = multer({ storage: storage });

// Function to upload image to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',  // Cloudinary will auto-detect the resource type (image, video, etc.)
        folder: 'uploads',      // Optional: Store images in a specific folder on Cloudinary
        // Removed public_id here to let Cloudinary generate it automatically
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error); // Log the error
          reject(error);  // Reject the promise if error occurs
        } else {
          console.log("Image uploaded successfully:", result); // Log the successful upload result
          resolve(result);  // Return the result, which includes the image URL and other info
        }
      }
    );
    
    // Upload the file buffer directly to Cloudinary
    uploadStream.end(file.buffer);
  });
};

// Export multer upload and uploadToCloudinary function for use in other files
module.exports = { upload, uploadToCloudinary };
