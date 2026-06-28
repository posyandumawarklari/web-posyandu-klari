const categoryService = require('../services/category.service');
const { sendSuccess } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    sendSuccess(res, { message: 'Daftar kategori berhasil dimuat.', data: categories });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const category = await categoryService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail kategori berhasil dimuat.', data: category });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    sendSuccess(res, { statusCode: 201, message: 'Kategori berhasil dibuat.', data: category });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    sendSuccess(res, { message: 'Kategori berhasil diperbarui.', data: category });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await categoryService.remove(req.params.id);
    sendSuccess(res, { message: 'Kategori berhasil dihapus.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
