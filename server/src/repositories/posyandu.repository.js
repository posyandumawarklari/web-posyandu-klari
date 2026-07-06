const prisma = require('../config/database');

const findAll = async () => {
  return prisma.posyanduPost.findMany({ orderBy: { name: 'asc' } });
};

const findById = async (id) => {
  return prisma.posyanduPost.findUnique({ where: { id } });
};

const create = async (data) => {
  return prisma.posyanduPost.create({ data });
};

const update = async (id, data) => {
  return prisma.posyanduPost.update({ where: { id }, data });
};

const remove = async (id) => {
  return prisma.posyanduPost.delete({ where: { id } });
};

const count = async () => {
  return prisma.posyanduPost.count();
};

module.exports = { findAll, findById, create, update, remove, count };
