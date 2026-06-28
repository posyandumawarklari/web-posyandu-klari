const prisma = require('../config/database');

const findAll = async ({ skip, limit }) => {
  const [data, total] = await Promise.all([
    prisma.gallery.findMany({
      skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { id: true, name: true } } },
    }),
    prisma.gallery.count(),
  ]);
  return { data, total };
};

const findById = async (id) => {
  return prisma.gallery.findUnique({
    where: { id },
    include: { uploadedBy: { select: { id: true, name: true } } },
  });
};

const create = async (data) => {
  return prisma.gallery.create({
    data,
    include: { uploadedBy: { select: { id: true, name: true } } },
  });
};

const update = async (id, data) => {
  return prisma.gallery.update({
    where: { id }, data,
    include: { uploadedBy: { select: { id: true, name: true } } },
  });
};

const remove = async (id) => {
  return prisma.gallery.delete({ where: { id } });
};

const count = async () => {
  return prisma.gallery.count();
};

module.exports = { findAll, findById, create, update, remove, count };
