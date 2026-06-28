const prisma = require('../config/database');

const findAll = async () => {
  return prisma.program.findMany({ orderBy: { createdAt: 'desc' } });
};

const findById = async (id) => {
  return prisma.program.findUnique({ where: { id } });
};

const create = async (data) => {
  return prisma.program.create({ data });
};

const update = async (id, data) => {
  return prisma.program.update({ where: { id }, data });
};

const remove = async (id) => {
  return prisma.program.delete({ where: { id } });
};

const count = async () => {
  return prisma.program.count();
};

module.exports = { findAll, findById, create, update, remove, count };
