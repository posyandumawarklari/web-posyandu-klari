const prisma = require('../config/database');

const findAll = async () => {
  return prisma.websiteSetting.findMany({ orderBy: { key: 'asc' } });
};

const findByKey = async (key) => {
  return prisma.websiteSetting.findUnique({ where: { key } });
};

const upsert = async (key, value) => {
  return prisma.websiteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};

const bulkUpsert = async (settings) => {
  const results = [];
  for (const { key, value } of settings) {
    const result = await upsert(key, value);
    results.push(result);
  }
  return results;
};

/**
 * Get settings as a key-value object
 */
const getAsObject = async () => {
  const settings = await findAll();
  const obj = {};
  settings.forEach((s) => { obj[s.key] = s.value; });
  return obj;
};

module.exports = { findAll, findByKey, upsert, bulkUpsert, getAsObject };
