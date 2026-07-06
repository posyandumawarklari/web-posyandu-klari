const settingRepository = require('../repositories/setting.repository');
const { uploadEntityImage, deleteImage } = require('./cloudinary.service');

const getAll = async () => settingRepository.getAsObject();

const update = async (settings, files = {}) => {
  // Handle logo upload
  if (files.logo && files.logo.length > 0) {
    const logoFile = files.logo[0];
    const currentLogo = await settingRepository.findByKey('site_logo');
    if (currentLogo && currentLogo.value) {
      await deleteImage(currentLogo.value);
    }
    const result = await uploadEntityImage(logoFile.buffer, 'settings');
    await settingRepository.upsert('site_logo', result.url);
  }

  // Handle hero_image upload
  if (files.hero_image && files.hero_image.length > 0) {
    const heroImageFile = files.hero_image[0];
    const currentHeroImage = await settingRepository.findByKey('hero_image');
    if (currentHeroImage && currentHeroImage.value) {
      await deleteImage(currentHeroImage.value);
    }
    const result = await uploadEntityImage(heroImageFile.buffer, 'settings');
    await settingRepository.upsert('hero_image', result.url);
  }

  // Bulk update other settings
  if (settings && settings.length > 0) {
    let settingsArray = settings;
    if (typeof settings === 'string') {
      settingsArray = JSON.parse(settings);
    }
    await settingRepository.bulkUpsert(settingsArray);
  }

  return settingRepository.getAsObject();
};

module.exports = { getAll, update };
