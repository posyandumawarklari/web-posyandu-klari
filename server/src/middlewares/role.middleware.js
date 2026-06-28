const { sendError } = require('../utils/response');

/**
 * Middleware to check if user has the required role(s)
 * Must be used AFTER verifyToken middleware
 * @param  {...string} roles - Allowed roles (e.g., 'ADMIN', 'CADRE')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, {
        statusCode: 401,
        message: 'Akses ditolak. Silakan login terlebih dahulu.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, {
        statusCode: 403,
        message: 'Anda tidak memiliki izin untuk mengakses fitur ini.',
      });
    }

    next();
  };
};

/**
 * Shortcut: Only Admin
 */
const adminOnly = requireRole('ADMIN');

/**
 * Shortcut: Admin or Cadre (any authenticated user)
 */
const authenticated = requireRole('ADMIN', 'CADRE');

module.exports = { requireRole, adminOnly, authenticated };
