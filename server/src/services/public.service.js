const prisma = require('../config/database');
const settingRepository = require('../repositories/setting.repository');
const scheduleRepository = require('../repositories/schedule.repository');

/**
 * Get all data needed for the homepage
 */
const getHomePage = async () => {
  const [settings, programs, schedules, latestArticles, galleryPreview] = await Promise.all([
    settingRepository.getAsObject(),
    prisma.program.findMany({ take: 6, orderBy: { createdAt: 'desc' } }),
    scheduleRepository.findUpcoming(),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      orderBy: { publishDate: 'desc' },
      select: {
        id: true, title: true, slug: true, thumbnail: true,
        excerpt: true, publishDate: true, createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
    }),
    prisma.gallery.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, imageUrl: true },
    }),
  ]);

  return { settings, programs, schedules, latestArticles, galleryPreview };
};

/**
 * Get published articles with search, filter, pagination
 */
const getArticles = async ({ skip, limit, search, categorySlug, tag }) => {
  const where = { status: 'PUBLISHED' };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (tag) {
    where.tags = { some: { tag: { slug: tag } } };
  }

  const [data, total] = await Promise.all([
    prisma.article.findMany({
      where, skip, take: limit,
      orderBy: { publishDate: 'desc' },
      select: {
        id: true, title: true, slug: true, thumbnail: true,
        excerpt: true, publishDate: true, createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, avatar: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  const formattedData = data.map((article) => ({
    ...article,
    tags: article.tags.map((t) => t.tag),
  }));

  return { data: formattedData, total };
};

/**
 * Get single article by slug (public)
 */
const getArticleBySlug = async (slug) => {
  const article = await prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      id: true, title: true, slug: true, thumbnail: true,
      content: true, excerpt: true, publishDate: true,
      seoTitle: true, seoDescription: true, createdAt: true,
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true, avatar: true } },
      tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
    },
  });

  if (!article) return null;

  // Get related articles (same category, exclude current)
  const relatedArticles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: article.id },
      categoryId: article.category?.id || undefined,
    },
    take: 3,
    orderBy: { publishDate: 'desc' },
    select: {
      id: true, title: true, slug: true, thumbnail: true,
      excerpt: true, publishDate: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return {
    ...article,
    tags: article.tags.map((t) => t.tag),
    relatedArticles,
  };
};

module.exports = { getHomePage, getArticles, getArticleBySlug };
