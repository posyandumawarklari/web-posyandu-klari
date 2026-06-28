const prisma = require('../config/database');

const findAll = async () => {
  return prisma.schedule.findMany({ orderBy: { date: 'asc' } });
};

const findUpcoming = async (limit = 5) => {
  return prisma.schedule.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: limit,
  });
};

const findById = async (id) => {
  return prisma.schedule.findUnique({ where: { id } });
};

const create = async (data) => {
  return prisma.schedule.create({ data });
};

const update = async (id, data) => {
  return prisma.schedule.update({ where: { id }, data });
};

const remove = async (id) => {
  return prisma.schedule.delete({ where: { id } });
};

module.exports = { findAll, findUpcoming, findById, create, update, remove };
