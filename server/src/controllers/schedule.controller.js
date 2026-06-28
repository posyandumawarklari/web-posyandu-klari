const scheduleService = require('../services/schedule.service');
const { sendSuccess } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getAll();
    sendSuccess(res, { message: 'Daftar jadwal berhasil dimuat.', data: schedules });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const schedule = await scheduleService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail jadwal berhasil dimuat.', data: schedule });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const schedule = await scheduleService.create(req.body);
    sendSuccess(res, { statusCode: 201, message: 'Jadwal berhasil dibuat.', data: schedule });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const schedule = await scheduleService.update(req.params.id, req.body);
    sendSuccess(res, { message: 'Jadwal berhasil diperbarui.', data: schedule });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await scheduleService.remove(req.params.id);
    sendSuccess(res, { message: 'Jadwal berhasil dihapus.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
