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
        resource_type: 'auto',  // Automatically detects the resource type (image, video, etc.)
        folder: 'uploads',      // Optional: Store the image in a specific folder
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          reject(error);  // Reject the promise on error
        } else {
          console.log("Image uploaded successfully:", result);
          resolve(result);  // Resolve with the result (includes image URL)
        }
      }
    );
    
    // End the stream by uploading the file buffer
    uploadStream.end(file.buffer);
  });
};

// Export multer upload and uploadToCloudinary function for use in other files
module.exports = { upload, uploadToCloudinary };
