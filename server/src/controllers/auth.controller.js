const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    sendSuccess(res, {
      message: 'Login berhasil.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh-token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    sendSuccess(res, {
      message: 'Token berhasil diperbarui.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);

    sendSuccess(res, {
      message: 'Profil berhasil dimuat.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(
      req.user.id,
      req.body,
      req.file || null
    );

    sendSuccess(res, {
      message: 'Profil berhasil diperbarui.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    sendSuccess(res, {
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
};
