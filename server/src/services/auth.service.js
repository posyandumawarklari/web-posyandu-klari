const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const authRepository = require('../repositories/auth.repository');
const { uploadEntityImage, deleteImage } = require('./cloudinary.service');

/**
 * Generate access and refresh tokens for a user
 */
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

/**
 * Format user data for API response (exclude sensitive fields)
 */
const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * Login with email and password
 */
const login = async (email, password) => {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    const error = new Error('Email atau password salah.');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Email atau password salah.');
    error.statusCode = 401;
    throw error;
  }

  const tokens = generateTokens(user);

  return {
    user: formatUser(user),
    ...tokens,
  };
};

/**
 * Refresh access token using a valid refresh token
 */
const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);
    const user = await authRepository.findById(decoded.id);

    if (!user) {
      const error = new Error('User tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const tokens = generateTokens(user);

    return {
      user: formatUser(user),
      ...tokens,
    };
  } catch (err) {
    if (err.statusCode) throw err;
    const error = new Error('Refresh token tidak valid atau sudah kedaluwarsa.');
    error.statusCode = 401;
    throw error;
  }
};

/**
 * Get current user profile
 */
const getProfile = async (userId) => {
  const user = await authRepository.findById(userId);

  if (!user) {
    const error = new Error('User tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }

  return formatUser(user);
};

/**
 * Update current user profile
 */
const updateProfile = async (userId, data, avatarFile) => {
  const existingUser = await authRepository.findById(userId);

  if (!existingUser) {
    const error = new Error('User tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }

  // Check email uniqueness if email is being changed
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await authRepository.findByEmail(data.email);
    if (emailExists) {
      const error = new Error('Email sudah digunakan oleh user lain.');
      error.statusCode = 409;
      throw error;
    }
  }

  const updateData = { ...data };

  // Handle avatar upload
  if (avatarFile) {
    // Delete old avatar from Cloudinary
    if (existingUser.avatar) {
      await deleteImage(existingUser.avatar);
    }
    const result = await uploadEntityImage(avatarFile.buffer, 'avatars');
    updateData.avatar = result.url;
  }

  const updatedUser = await authRepository.updateProfile(userId, updateData);
  return formatUser(updatedUser);
};

/**
 * Change password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await authRepository.findByIdWithPassword(userId);

  if (!user) {
    const error = new Error('User tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    const error = new Error('Password lama tidak sesuai.');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await authRepository.updatePassword(userId, hashedPassword);

  return { message: 'Password berhasil diubah.' };
};

module.exports = {
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
};
