const programRepository = require('../repositories/program.repository');
const { uploadEntityImage, deleteImage } = require('./cloudinary.service');

const getAll = async () => programRepository.findAll();

const getById = async (id) => {
  const program = await programRepository.findById(id);
  if (!program) { const e = new Error('Program tidak ditemukan.'); e.statusCode = 404; throw e; }
  return program;
};

const create = async (data, imageFile) => {
  const programData = { ...data };
  if (imageFile) {
    const result = await uploadEntityImage(imageFile.buffer, 'programs');
    programData.image = result.url;
  }
  return programRepository.create(programData);
};

const update = async (id, data, imageFile) => {
  const existing = await getById(id);
  const updateData = { ...data };
  if (imageFile) {
    if (existing.image) await deleteImage(existing.image);
    const result = await uploadEntityImage(imageFile.buffer, 'programs');
    updateData.image = result.url;
  }
  return programRepository.update(id, updateData);
};

const remove = async (id) => {
  const program = await getById(id);
  if (program.image) await deleteImage(program.image);
  return programRepository.remove(id);
};

module.exports = { getAll, getById, create, update, remove };
