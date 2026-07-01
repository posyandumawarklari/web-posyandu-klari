const prisma = require('../config/database');

/**
 * Find a user by email
 */
const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Find a user by ID
 */
const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update user profile
 */
const updateProfile = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update user password
 */
const updatePassword = async (id, hashedPassword) => {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};

/**
 * Find user by ID including password (for verification)
 */
const findByIdWithPassword = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

module.exports = {
  findByEmail,
  findById,
  updateProfile,
  updatePassword,
  findByIdWithPassword,
};
