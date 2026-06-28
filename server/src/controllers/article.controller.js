const articleService = require('../services/article.service');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, categoryId, status, authorId } = req.query;
    const { data, total } = await articleService.getAll({ page, limit, skip, search, categoryId, status, authorId });
    sendPaginated(res, { data, page, limit, total, message: 'Daftar artikel berhasil dimuat.' });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const article = await articleService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail artikel berhasil dimuat.', data: article });
  } catch (error) { next(error); }
};

const getBySlug = async (req, res, next) => {
  try {
    const article = await articleService.getBySlug(req.params.slug);
    sendSuccess(res, { message: 'Detail artikel berhasil dimuat.', data: article });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const article = await articleService.create(req.body, req.user.id, req.file || null);
    sendSuccess(res, { statusCode: 201, message: 'Artikel berhasil dibuat.', data: article });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const article = await articleService.update(req.params.id, req.body, req.file || null, req.user.id, req.user.role);
    sendSuccess(res, { message: 'Artikel berhasil diperbarui.', data: article });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await articleService.remove(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, { message: 'Artikel berhasil dihapus.' });
  } catch (error) { next(error); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const article = await articleService.updateStatus(req.params.id, status, req.user.id, req.user.role);
    sendSuccess(res, { message: 'Status artikel berhasil diperbarui.', data: article });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, getBySlug, create, update, remove, updateStatus };
