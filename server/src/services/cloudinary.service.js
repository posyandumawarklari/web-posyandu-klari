const cloudinary = require('../config/cloudinary');

/**
 * Upload an image buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from Multer memory storage
 * @param {string} folder - The Cloudinary folder to upload to
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadImage = (fileBuffer, folder = 'posyandu') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Gagal mengupload gambar: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary by its URL
 * @param {string} imageUrl - The Cloudinary image URL
 * @returns {Promise<void>}
 */
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{filename}.{ext}
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return;

    // Get everything after 'upload/v{version}/' without file extension
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = pathAfterUpload.replace(/\.[^.]+$/, '');

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
    // Don't throw — image deletion failure shouldn't block the main operation
  }
};

/**
 * Upload an image for a specific entity type
 * Creates organized folder structure in Cloudinary
 */
const uploadEntityImage = async (fileBuffer, entityType) => {
  const folder = `posyandu/${entityType}`;
  return uploadImage(fileBuffer, folder);
};

module.exports = { uploadImage, deleteImage, uploadEntityImage };
