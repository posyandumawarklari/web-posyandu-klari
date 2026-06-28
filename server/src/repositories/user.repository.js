const prisma = require('../config/database');

const findAll = async ({ skip, limit, search, role }) => {
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role;

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, avatar: true,
        role: true, createdAt: true, updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
};

const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, avatar: true,
      role: true, createdAt: true, updatedAt: true,
      _count: { select: { articles: true, galleries: true } },
    },
  });
};

const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const create = async (data) => {
  return prisma.user.create({
    data,
    select: {
      id: true, name: true, email: true, avatar: true,
      role: true, createdAt: true, updatedAt: true,
    },
  });
};

const update = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true, name: true, email: true, avatar: true,
      role: true, createdAt: true, updatedAt: true,
    },
  });
};

const remove = async (id) => {
  return prisma.user.delete({ where: { id } });
};

module.exports = { findAll, findById, findByEmail, create, update, remove };
