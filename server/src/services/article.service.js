const articleRepository = require('../repositories/article.repository');
const { generateSlug, generateUniqueSlug, calculateReadingTime } = require('../utils/helpers');
const { uploadEntityImage, deleteImage } = require('./cloudinary.service');

const getAll = async ({ page, limit, skip, search, categoryId, status, authorId }) => {
  return articleRepository.findAll({ skip, limit, search, categoryId, status, authorId });
};

const getById = async (id) => {
  const article = await articleRepository.findById(id);
  if (!article) { const e = new Error('Artikel tidak ditemukan.'); e.statusCode = 404; throw e; }
  return article;
};

const getBySlug = async (slug) => {
  const article = await articleRepository.findBySlug(slug);
  if (!article) { const e = new Error('Artikel tidak ditemukan.'); e.statusCode = 404; throw e; }
  return article;
};

const create = async (data, authorId, thumbnailFile) => {
  const { tags, ...articleData } = data;

  // Generate unique slug
  let slug = generateSlug(articleData.title);
  const existing = await articleRepository.findBySlug(slug);
  if (existing) slug = generateUniqueSlug(articleData.title);

  // Upload thumbnail
  if (thumbnailFile) {
    const result = await uploadEntityImage(thumbnailFile.buffer, 'articles');
    articleData.thumbnail = result.url;
  }

  // Set publish date if publishing
  if (articleData.status === 'PUBLISHED' && !articleData.publishDate) {
    articleData.publishDate = new Date();
  }
  if (articleData.publishDate) {
    articleData.publishDate = new Date(articleData.publishDate);
  }

  const article = await articleRepository.create({
    ...articleData,
    slug,
    authorId,
  });

  // Set tags
  if (tags && tags.length > 0) {
    await articleRepository.setTags(article.id, tags);
  }

  return articleRepository.findById(article.id);
};

const update = async (id, data, thumbnailFile, userId, userRole) => {
  const existing = await articleRepository.findById(id);
  if (!existing) { const e = new Error('Artikel tidak ditemukan.'); e.statusCode = 404; throw e; }

  // Cadre can only edit own articles
  if (userRole === 'CADRE' && existing.author.id !== userId) {
    const e = new Error('Anda hanya bisa mengedit artikel milik sendiri.');
    e.statusCode = 403;
    throw e;
  }

  const { tags, ...articleData } = data;

  // Update slug if title changes
  if (articleData.title && articleData.title !== existing.title) {
    let slug = generateSlug(articleData.title);
    const slugExists = await articleRepository.findBySlug(slug);
    if (slugExists && slugExists.id !== id) slug = generateUniqueSlug(articleData.title);
    articleData.slug = slug;
  }

  // Upload new thumbnail
  if (thumbnailFile) {
    if (existing.thumbnail) await deleteImage(existing.thumbnail);
    const result = await uploadEntityImage(thumbnailFile.buffer, 'articles');
    articleData.thumbnail = result.url;
  }

  // Handle publish date
  if (articleData.status === 'PUBLISHED' && !existing.publishDate && !articleData.publishDate) {
    articleData.publishDate = new Date();
  }
  if (articleData.publishDate) {
    articleData.publishDate = new Date(articleData.publishDate);
  }

  const article = await articleRepository.update(id, articleData);

  // Update tags if provided
  if (tags !== undefined) {
    await articleRepository.setTags(id, tags || []);
  }

  return articleRepository.findById(article.id);
};

const remove = async (id, userId, userRole) => {
  const article = await articleRepository.findById(id);
  if (!article) { const e = new Error('Artikel tidak ditemukan.'); e.statusCode = 404; throw e; }

  if (userRole === 'CADRE' && article.author.id !== userId) {
    const e = new Error('Anda hanya bisa menghapus artikel milik sendiri.');
    e.statusCode = 403;
    throw e;
  }

  if (article.thumbnail) await deleteImage(article.thumbnail);
  return articleRepository.remove(id);
};

const updateStatus = async (id, status, userId, userRole) => {
  const article = await articleRepository.findById(id);
  if (!article) { const e = new Error('Artikel tidak ditemukan.'); e.statusCode = 404; throw e; }

  if (userRole === 'CADRE' && article.author.id !== userId) {
    const e = new Error('Anda hanya bisa mengubah status artikel milik sendiri.');
    e.statusCode = 403;
    throw e;
  }

  const updateData = { status };
  if (status === 'PUBLISHED' && !article.publishDate) {
    updateData.publishDate = new Date();
  }

  return articleRepository.update(id, updateData);
};

module.exports = { getAll, getById, getBySlug, create, update, remove, updateStatus };
