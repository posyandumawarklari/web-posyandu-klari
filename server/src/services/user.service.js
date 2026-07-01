const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const { uploadEntityImage, deleteImage } = require('./cloudinary.service');

const getAll = async ({ page, limit, skip, search, role }) => {
  return userRepository.findAll({ skip, limit, search, role });
};

const getById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('User tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const create = async (data, avatarFile) => {
  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    const error = new Error('Email sudah digunakan.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const userData = { ...data, password: hashedPassword };

  if (avatarFile) {
    const result = await uploadEntityImage(avatarFile.buffer, 'avatars');
    userData.avatar = result.url;
  }

  return userRepository.create(userData);
};

const update = async (id, data, avatarFile) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('User tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }

  if (data.email && data.email !== user.email) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      const error = new Error('Email sudah digunakan.');
      error.statusCode = 409;
      throw error;
    }
  }

  const updateData = { ...data };

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 12);
  }

  if (avatarFile) {
    if (user.avatar) await deleteImage(user.avatar);
    const result = await uploadEntityImage(avatarFile.buffer, 'avatars');
    updateData.avatar = result.url;
  }

  return userRepository.update(id, updateData);
};

const remove = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('User tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }
  if (user.avatar) await deleteImage(user.avatar);
  return userRepository.remove(id);
};

const resetPassword = async (id, newPassword) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('User tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }
  const hashed = await bcrypt.hash(newPassword, 12);
  return userRepository.update(id, { password: hashed });
};

module.exports = { getAll, getById, create, update, remove, resetPassword };
