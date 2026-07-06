const posyanduRepository = require('../repositories/posyandu.repository');

const getAll = async () => posyanduRepository.findAll();

const getById = async (id) => {
  const posyandu = await posyanduRepository.findById(id);
  if (!posyandu) {
    const e = new Error('Posyandu tidak ditemukan.');
    e.statusCode = 404;
    throw e;
  }
  return posyandu;
};

const create = async (data) => {
  return posyanduRepository.create(data);
};

const update = async (id, data) => {
  await getById(id); // ensure exists
  return posyanduRepository.update(id, data);
};

const remove = async (id) => {
  await getById(id); // ensure exists
  return posyanduRepository.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
