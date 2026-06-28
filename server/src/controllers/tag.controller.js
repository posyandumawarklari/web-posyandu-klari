const tagService = require('../services/tag.service');
const { sendSuccess } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const tags = await tagService.getAll();
    sendSuccess(res, { message: 'Daftar tag berhasil dimuat.', data: tags });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const tag = await tagService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail tag berhasil dimuat.', data: tag });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const tag = await tagService.create(req.body);
    sendSuccess(res, { statusCode: 201, message: 'Tag berhasil dibuat.', data: tag });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const tag = await tagService.update(req.params.id, req.body);
    sendSuccess(res, { message: 'Tag berhasil diperbarui.', data: tag });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await tagService.remove(req.params.id);
    sendSuccess(res, { message: 'Tag berhasil dihapus.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
