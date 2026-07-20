const galleryService = require('../services/gallery.service');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { data, total } = await galleryService.getAll({ page, limit, skip });
    sendPaginated(res, { data, page, limit, total, message: 'Daftar galeri berhasil dimuat.' });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const gallery = await galleryService.getById(req.params.id);
    sendSuccess(res, { message: 'Detail foto berhasil dimuat.', data: gallery });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const gallery = await galleryService.create(req.body, req.file || null, req.user.id);
    sendSuccess(res, { statusCode: 201, message: 'Foto berhasil diupload.', data: gallery });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const gallery = await galleryService.update(req.params.id, req.body, req.file || null, req.user.id, req.user.role);
    sendSuccess(res, { message: 'Foto berhasil diperbarui.', data: gallery });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await galleryService.remove(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, { message: 'Foto berhasil dihapus.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
