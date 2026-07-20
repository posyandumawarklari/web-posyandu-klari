const galleryRepository = require('../repositories/gallery.repository');
const { uploadEntityImage, deleteImage } = require('./cloudinary.service');

const getAll = async ({ page, limit, skip }) => {
  return galleryRepository.findAll({ skip, limit });
};

const getById = async (id) => {
  const gallery = await galleryRepository.findById(id);
  if (!gallery) { const e = new Error('Foto tidak ditemukan.'); e.statusCode = 404; throw e; }
  return gallery;
};

const create = async (data, imageFile, userId) => {
  if (!imageFile) {
    const e = new Error('Gambar wajib diupload.');
    e.statusCode = 400;
    throw e;
  }
  const result = await uploadEntityImage(imageFile.buffer, 'gallery');
  return galleryRepository.create({
    ...data,
    imageUrl: result.url,
    uploadedById: userId,
  });
};

const update = async (id, data, imageFile, userId, userRole) => {
  const existing = await getById(id);
  
  if (userRole === 'CADRE' && existing.uploadedById !== userId) {
    const e = new Error('Anda tidak memiliki akses untuk mengubah galeri ini');
    e.statusCode = 403;
    throw e;
  }

  const updateData = { ...data };
  if (imageFile) {
    if (existing.imageUrl) await deleteImage(existing.imageUrl);
    const result = await uploadEntityImage(imageFile.buffer, 'gallery');
    updateData.imageUrl = result.url;
  }
  return galleryRepository.update(id, updateData);
};

const remove = async (id, userId, userRole) => {
  const gallery = await getById(id);

  if (userRole === 'CADRE' && gallery.uploadedById !== userId) {
    const e = new Error('Anda tidak memiliki akses untuk mengubah galeri ini');
    e.statusCode = 403;
    throw e;
  }

  if (gallery.imageUrl) await deleteImage(gallery.imageUrl);
  return galleryRepository.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
