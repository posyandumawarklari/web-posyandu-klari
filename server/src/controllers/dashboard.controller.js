const dashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/response');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    sendSuccess(res, { message: 'Statistik dashboard berhasil dimuat.', data: stats });
  } catch (error) { next(error); }
};

module.exports = { getStats };
