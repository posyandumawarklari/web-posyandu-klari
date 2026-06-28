const prisma = require('../config/database');

const findAll = async () => {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });
};

const findById = async (id) => {
  return prisma.tag.findUnique({ where: { id } });
};

const findBySlug = async (slug) => {
  return prisma.tag.findUnique({ where: { slug } });
};

const create = async (data) => {
  return prisma.tag.create({ data });
};

const update = async (id, data) => {
  return prisma.tag.update({ where: { id }, data });
};

const remove = async (id) => {
  return prisma.tag.delete({ where: { id } });
};

module.exports = { findAll, findById, findBySlug, create, update, remove };
