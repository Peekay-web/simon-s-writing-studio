const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudinaryService {
    /**
     * Upload a file to Cloudinary
     * @param {string} filePath - Path to the local file
     * @param {string} folder - Cloudinary folder name
     * @returns {Promise<object>} - Upload result
     */
    static async uploadFile(filePath, folder = 'portfolio') {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: `simon-writing-studio/${folder}`,
                resource_type: 'auto', // Automatically detect if it's an image or document
                use_filename: true,
                unique_filename: true
            });

            // Clean up local file after upload
            try {
                await fs.unlink(filePath);
            } catch (unlinkErr) {
                console.error('Error deleting local file after Cloudinary upload:', unlinkErr.message);
            }

            return {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                size: result.bytes,
                originalName: result.original_filename
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
    }

    /**
     * Delete a file from Cloudinary
     * @param {string} publicId - Cloudinary public ID
     */
    static async deleteFile(publicId) {
        if (!publicId) return;
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            // We don't throw here to avoid failing the whole request if cleanup fails
        }
    }
}

module.exports = CloudinaryService;
