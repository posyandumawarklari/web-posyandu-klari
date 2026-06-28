const categoryRepository = require('../repositories/category.repository');
const { generateSlug } = require('../utils/helpers');

const getAll = async () => {
  return categoryRepository.findAll();
};

const getById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    const error = new Error('Kategori tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }
  return category;
};

const create = async (data) => {
  const slug = generateSlug(data.name);
  const existing = await categoryRepository.findBySlug(slug);
  if (existing) {
    const error = new Error('Kategori dengan nama tersebut sudah ada.');
    error.statusCode = 409;
    throw error;
  }
  return categoryRepository.create({ ...data, slug });
};

const update = async (id, data) => {
  await getById(id);
  const updateData = { ...data };
  if (data.name) {
    updateData.slug = generateSlug(data.name);
    const existing = await categoryRepository.findBySlug(updateData.slug);
    if (existing && existing.id !== id) {
      const error = new Error('Kategori dengan nama tersebut sudah ada.');
      error.statusCode = 409;
      throw error;
    }
  }
  return categoryRepository.update(id, updateData);
};

const remove = async (id) => {
  const category = await getById(id);
  if (category._count?.articles > 0) {
    const error = new Error('Tidak bisa menghapus kategori yang masih memiliki artikel.');
    error.statusCode = 400;
    throw error;
  }
  return categoryRepository.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
