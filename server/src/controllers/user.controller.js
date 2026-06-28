const userService = require('../services/user.service');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, role } = req.query;
    const { data, total } = await userService.getAll({ page, limit, skip, search, role });
    sendPaginated(res, { data, page, limit, total, message: 'Daftar user berhasil dimuat.' });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail user berhasil dimuat.', data: user });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const user = await userService.create(req.body, req.file || null);
    sendSuccess(res, { statusCode: 201, message: 'User berhasil dibuat.', data: user });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body, req.file || null);
    sendSuccess(res, { message: 'User berhasil diperbarui.', data: user });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await userService.remove(req.params.id);
    sendSuccess(res, { message: 'User berhasil dihapus.' });
  } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
  try {
    await userService.resetPassword(req.params.id, req.body.newPassword);
    sendSuccess(res, { message: 'Password berhasil direset.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove, resetPassword };
