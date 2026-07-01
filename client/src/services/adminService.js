import api from './api';

const createFormData = (data, fileField = null) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === fileField && value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

// Helper for multipart requests
const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
// Dashboard
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

// Users
export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => {
    const formData = createFormData(data, 'avatar');
    return api.post('/users', formData, multipartConfig);
  },
  update: (id, data) => {
    const formData = createFormData(data, 'avatar');
    return api.put(`/users/${id}`, formData, multipartConfig);
  },
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, newPassword) => api.patch(`/users/${id}/reset-password`, { newPassword }),
};

// Categories
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Tags
export const tagService = {
  getAll: () => api.get('/tags'),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// Articles
export const articleService = {
  getAll: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => {
    const formData = createFormData(data, 'thumbnail');
    return api.post('/articles', formData, multipartConfig);
  },
  update: (id, data) => {
    const formData = createFormData(data, 'thumbnail');
    return api.put(`/articles/${id}`, formData, multipartConfig);
  },
  delete: (id) => api.delete(`/articles/${id}`),
  updateStatus: (id, status) => api.patch(`/articles/${id}/status`, { status }),
};

// Programs
export const programService = {
  getAll: () => api.get('/programs'),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => {
    const formData = createFormData(data, 'image');
    return api.post('/programs', formData, multipartConfig);
  },
  update: (id, data) => {
    const formData = createFormData(data, 'image');
    return api.put(`/programs/${id}`, formData, multipartConfig);
  },
  delete: (id) => api.delete(`/programs/${id}`),
};

// Gallery
export const galleryService = {
  getAll: (params) => api.get('/gallery', { params }),
  getById: (id) => api.get(`/gallery/${id}`),
  create: (data) => {
    const formData = createFormData(data, 'image');
    return api.post('/gallery', formData, multipartConfig);
  },
  update: (id, data) => {
    const formData = createFormData(data, 'image');
    return api.put(`/gallery/${id}`, formData, multipartConfig);
  },
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Schedules
export const scheduleService = {
  getAll: () => api.get('/schedules'),
  getById: (id) => api.get(`/schedules/${id}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

// Settings
export const settingService = {
  getAll: () => api.get('/settings'),
  update: (data, logoFile) => {
    if (logoFile) {
      const formData = new FormData();
      formData.append('logo', logoFile);
      formData.append('settings', JSON.stringify(data.settings));
      return api.put('/settings', formData, multipartConfig);
    }
    return api.put('/settings', data);
  },
};
