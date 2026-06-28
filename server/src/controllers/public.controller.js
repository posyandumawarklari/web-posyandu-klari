const publicService = require('../services/public.service');
const { sendSuccess, sendPaginated, sendError } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getHomePage = async (req, res, next) => {
  try {
    const data = await publicService.getHomePage();
    sendSuccess(res, { message: 'Data homepage berhasil dimuat.', data });
  } catch (error) { next(error); }
};

const getArticles = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, category, tag } = req.query;
    const { data, total } = await publicService.getArticles({
      skip, limit, search, categorySlug: category, tag,
    });
    sendPaginated(res, { data, page, limit, total, message: 'Daftar artikel berhasil dimuat.' });
  } catch (error) { next(error); }
};

const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await publicService.getArticleBySlug(req.params.slug);
    if (!article) {
      return sendError(res, { statusCode: 404, message: 'Artikel tidak ditemukan.' });
    }
    sendSuccess(res, { message: 'Detail artikel berhasil dimuat.', data: article });
  } catch (error) { next(error); }
};

module.exports = { getHomePage, getArticles, getArticleBySlug };
