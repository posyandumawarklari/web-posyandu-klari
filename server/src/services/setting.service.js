const settingRepository = require('../repositories/setting.repository');
const { uploadEntityImage, deleteImage } = require('./cloudinary.service');

const getAll = async () => settingRepository.getAsObject();

const update = async (settings, logoFile) => {
  // Handle logo upload separately
  if (logoFile) {
    const currentLogo = await settingRepository.findByKey('site_logo');
    if (currentLogo && currentLogo.value) {
      await deleteImage(currentLogo.value);
    }
    const result = await uploadEntityImage(logoFile.buffer, 'settings');
    await settingRepository.upsert('site_logo', result.url);
  }

  // Bulk update other settings
  if (settings && settings.length > 0) {
    await settingRepository.bulkUpsert(settings);
  }

  return settingRepository.getAsObject();
};

module.exports = { getAll, update };
