const scheduleRepository = require('../repositories/schedule.repository');

const getAll = async () => scheduleRepository.findAll();
const getUpcoming = async () => scheduleRepository.findUpcoming();

const getById = async (id) => {
  const schedule = await scheduleRepository.findById(id);
  if (!schedule) { const e = new Error('Jadwal tidak ditemukan.'); e.statusCode = 404; throw e; }
  return schedule;
};

const create = async (data) => {
  return scheduleRepository.create({
    ...data,
    date: new Date(data.date),
  });
};

const update = async (id, data) => {
  await getById(id);
  const updateData = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  return scheduleRepository.update(id, updateData);
};

const remove = async (id) => {
  await getById(id);
  return scheduleRepository.remove(id);
};

module.exports = { getAll, getUpcoming, getById, create, update, remove };
