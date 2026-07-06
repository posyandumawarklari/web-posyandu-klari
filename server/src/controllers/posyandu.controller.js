const posyanduService = require('../services/posyandu.service');
const { sendSuccess } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const posyandus = await posyanduService.getAll();
    sendSuccess(res, { message: 'Daftar posyandu berhasil dimuat.', data: posyandus });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const posyandu = await posyanduService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail posyandu berhasil dimuat.', data: posyandu });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const posyandu = await posyanduService.create(req.body);
    sendSuccess(res, { statusCode: 201, message: 'Posyandu berhasil dibuat.', data: posyandu });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const posyandu = await posyanduService.update(req.params.id, req.body);
    sendSuccess(res, { message: 'Posyandu berhasil diperbarui.', data: posyandu });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await posyanduService.remove(req.params.id);
    sendSuccess(res, { message: 'Posyandu berhasil dihapus.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
