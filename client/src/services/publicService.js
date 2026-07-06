import api from './api';

export const publicService = {
  getHomePage: () => api.get('/public/home'),
  getArticles: (params) => api.get('/public/articles', { params }),
  getArticleBySlug: (slug) => api.get(`/public/articles/${slug}`),
  getPrograms: () => api.get('/programs'),
  getGallery: (params) => api.get('/gallery', { params }),
  getSchedules: () => api.get('/schedules'),
  getCategories: () => api.get('/categories'),
  getTags: () => api.get('/tags'),
  getSettings: () => api.get('/settings'),
  getPosyanduPosts: () => api.get('/posyandu-posts'),
};
