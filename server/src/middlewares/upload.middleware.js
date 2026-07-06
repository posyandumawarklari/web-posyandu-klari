const multer = require('multer');
const path = require('path');
const { sendError } = require('../utils/response');

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WebP.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
});

/**
 * Middleware to handle multer errors gracefully
 */
const handleUpload = (fieldName) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, {
            statusCode: 400,
            message: 'Ukuran file terlalu besar. Maksimum 2MB.',
          });
        }
        return sendError(res, {
          statusCode: 400,
          message: err.message,
        });
      }

      if (err) {
        return sendError(res, {
          statusCode: 400,
          message: err.message,
        });
      }

      next();
    });
  };
};

/**
 * Middleware to handle multiple file fields
 * @param {Array} fields - Array of objects e.g. [{ name: 'logo', maxCount: 1 }]
 */
const handleUploadFields = (fields) => {
  return (req, res, next) => {
    const uploadMultiple = upload.fields(fields);

    uploadMultiple(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, {
            statusCode: 400,
            message: 'Ukuran file terlalu besar. Maksimum 2MB.',
          });
        }
        return sendError(res, {
          statusCode: 400,
          message: err.message,
        });
      }

      if (err) {
        return sendError(res, {
          statusCode: 400,
          message: err.message,
        });
      }

      next();
    });
  };
};

module.exports = { upload, handleUpload, handleUploadFields };
