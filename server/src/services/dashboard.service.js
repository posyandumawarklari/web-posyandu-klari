const prisma = require('../config/database');

const getStats = async () => {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    totalPrograms,
    totalGallery,
    totalUsers,
    totalSchedules,
    totalCategories,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.program.count(),
    prisma.gallery.count(),
    prisma.user.count(),
    prisma.schedule.count(),
    prisma.category.count(),
  ]);

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, slug: true, status: true, createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    totalPrograms,
    totalGallery,
    totalUsers,
    totalSchedules,
    totalCategories,
    recentArticles,
  };
};

module.exports = { getStats };
