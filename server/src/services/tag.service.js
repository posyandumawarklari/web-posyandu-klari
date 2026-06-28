const tagRepository = require('../repositories/tag.repository');
const { generateSlug } = require('../utils/helpers');

const getAll = async () => tagRepository.findAll();

const getById = async (id) => {
  const tag = await tagRepository.findById(id);
  if (!tag) { const e = new Error('Tag tidak ditemukan.'); e.statusCode = 404; throw e; }
  return tag;
};

const create = async (data) => {
  const slug = generateSlug(data.name);
  const existing = await tagRepository.findBySlug(slug);
  if (existing) { const e = new Error('Tag sudah ada.'); e.statusCode = 409; throw e; }
  return tagRepository.create({ ...data, slug });
};

const update = async (id, data) => {
  await getById(id);
  const updateData = { ...data };
  if (data.name) {
    updateData.slug = generateSlug(data.name);
    const existing = await tagRepository.findBySlug(updateData.slug);
    if (existing && existing.id !== id) { const e = new Error('Tag sudah ada.'); e.statusCode = 409; throw e; }
  }
  return tagRepository.update(id, updateData);
};

const remove = async (id) => {
  await getById(id);
  return tagRepository.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
