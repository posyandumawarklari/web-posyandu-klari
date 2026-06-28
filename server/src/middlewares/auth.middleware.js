const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
const config = require('../config/env');

/**
 * Middleware to verify JWT access token
 * Attaches decoded user data to req.user
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, {
      statusCode: 401,
      message: 'Akses ditolak. Token tidak ditemukan.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, {
        statusCode: 401,
        message: 'Token sudah kedaluwarsa. Silakan login kembali.',
      });
    }

    return sendError(res, {
      statusCode: 401,
      message: 'Token tidak valid.',
    });
  }
};

/**
 * Optional auth — attaches user if token exists, continues regardless
 * Useful for public routes that need optional user context
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
  } catch {
    // Token invalid — continue without user
  }

  next();
};

module.exports = { verifyToken, optionalAuth };
