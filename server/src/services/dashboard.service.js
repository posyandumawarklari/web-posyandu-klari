const prisma = require('../config/database');

const getStats = async () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    totalPrograms,
    totalGallery,
    totalUsers,
    totalSchedules,
    activitiesThisMonth,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.program.count(),
    prisma.gallery.count(),
    prisma.user.count(),
    prisma.schedule.count(),
    prisma.schedule.count({
      where: {
        date: { gte: firstDayOfMonth, lte: lastDayOfMonth }
      }
    }),
  ]);

  const [recentArticles, upcomingSchedules] = await Promise.all([
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, status: true, createdAt: true,
        author: { select: { id: true, name: true } },
      },
    }),
    prisma.schedule.findMany({
      take: 5,
      where: { date: { gte: startOfToday } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
  ]);

  return {
    stats: {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalPrograms,
      totalGallery,
      totalUsers,
      totalSchedules,
      activitiesThisMonth,
    },
    recentArticles,
    upcomingSchedules,
  };
};

module.exports = { getStats };
