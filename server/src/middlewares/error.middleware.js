const { sendError } = require('../utils/response');

/**
 * Handle 404 - Route not found
 */
const notFoundHandler = (req, res) => {
  sendError(res, {
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err);

  // Prisma known errors
  if (err.code === 'P2002') {
    return sendError(res, {
      statusCode: 409,
      message: 'Data sudah ada. Periksa kembali input Anda.',
    });
  }

  if (err.code === 'P2003') {
    return sendError(res, {
      statusCode: 400,
      message: 'Data referensi tidak valid atau tidak ditemukan.',
    });
  }

  if (err.code === 'P2025') {
    return sendError(res, {
      statusCode: 404,
      message: 'Data tidak ditemukan.',
    });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, {
      statusCode: 400,
      message: 'Ukuran file terlalu besar. Maksimum 5MB.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, {
      statusCode: 400,
      message: 'Field file tidak valid.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, {
      statusCode: 401,
      message: 'Token tidak valid.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, {
      statusCode: 401,
      message: 'Token sudah kedaluwarsa.',
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, {
      statusCode: 400,
      message: 'Validasi gagal.',
      errors,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.' 
    : (err.message || 'Internal Server Error');

  sendError(res, { statusCode, message });
};

module.exports = { notFoundHandler, errorHandler };
