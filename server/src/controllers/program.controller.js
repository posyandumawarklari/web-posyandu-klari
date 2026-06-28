const programService = require('../services/program.service');
const { sendSuccess } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const programs = await programService.getAll();
    sendSuccess(res, { message: 'Daftar program berhasil dimuat.', data: programs });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const program = await programService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail program berhasil dimuat.', data: program });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const program = await programService.create(req.body, req.file || null);
    sendSuccess(res, { statusCode: 201, message: 'Program berhasil dibuat.', data: program });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const program = await programService.update(req.params.id, req.body, req.file || null);
    sendSuccess(res, { message: 'Program berhasil diperbarui.', data: program });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await programService.remove(req.params.id);
    sendSuccess(res, { message: 'Program berhasil dihapus.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
