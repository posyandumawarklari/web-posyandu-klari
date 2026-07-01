const { sendSuccess, sendError } = require('../utils/response');
const { uploadEntityImage } = require('../services/cloudinary.service');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, { statusCode: 400, message: 'Tidak ada file yang diunggah.' });
    }
    // Handle either "image" field or generic "file" depending on frontend.
    // Client sends formData.append('image', file);
    const result = await uploadEntityImage(req.file.buffer, 'uploads');
    sendSuccess(res, { message: 'Upload berhasil.', data: { url: result.url } });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
