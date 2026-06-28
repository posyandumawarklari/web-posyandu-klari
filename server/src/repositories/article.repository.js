const prisma = require('../config/database');

const articleSelect = {
  id: true, title: true, slug: true, thumbnail: true,
  content: true, excerpt: true, status: true,
  publishDate: true, seoTitle: true, seoDescription: true,
  createdAt: true, updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, avatar: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
};

const articleListSelect = {
  id: true, title: true, slug: true, thumbnail: true,
  excerpt: true, status: true, publishDate: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, avatar: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
};

const formatArticle = (article) => {
  if (!article) return null;
  return {
    ...article,
    tags: article.tags ? article.tags.map((t) => t.tag) : [],
  };
};

const findAll = async ({ skip, limit, search, categoryId, status, authorId }) => {
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;
  if (authorId) where.authorId = authorId;

  const [data, total] = await Promise.all([
    prisma.article.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      select: articleListSelect,
    }),
    prisma.article.count({ where }),
  ]);

  return { data: data.map(formatArticle), total };
};

const findById = async (id) => {
  const article = await prisma.article.findUnique({
    where: { id }, select: articleSelect,
  });
  return formatArticle(article);
};

const findBySlug = async (slug) => {
  const article = await prisma.article.findUnique({
    where: { slug }, select: articleSelect,
  });
  return formatArticle(article);
};

const create = async (data) => {
  const article = await prisma.article.create({
    data, select: articleSelect,
  });
  return formatArticle(article);
};

const update = async (id, data) => {
  const article = await prisma.article.update({
    where: { id }, data, select: articleSelect,
  });
  return formatArticle(article);
};

const remove = async (id) => {
  return prisma.article.delete({ where: { id } });
};

const setTags = async (articleId, tagIds) => {
  // Remove all existing tags
  await prisma.articleTag.deleteMany({ where: { articleId } });
  // Add new tags
  if (tagIds && tagIds.length > 0) {
    await prisma.articleTag.createMany({
      data: tagIds.map((tagId) => ({ articleId, tagId })),
    });
  }
};

module.exports = { findAll, findById, findBySlug, create, update, remove, setTags };
