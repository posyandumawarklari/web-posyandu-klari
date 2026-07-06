const settingService = require('../services/setting.service');
const { sendSuccess } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const settings = await settingService.getAll();
    sendSuccess(res, { message: 'Pengaturan berhasil dimuat.', data: settings });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const settings = await settingService.update(req.body.settings, req.files || {});
    sendSuccess(res, { message: 'Pengaturan berhasil diperbarui.', data: settings });
  } catch (error) { next(error); }
};

module.exports = { getAll, update };
