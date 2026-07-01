import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  dashboardService,
  userService,
  categoryService,
  tagService,
  articleService,
  programService,
  galleryService,
  scheduleService,
  settingService,
} from '../services/adminService';
import toast from 'react-hot-toast';

// ─── Dashboard ───────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => dashboardService.getStats().then((res) => res.data.data),
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Generic CRUD Hook Factory ──────────────────
function createCrudHooks(key, service, labels) {

  const useGetAll = (params) =>
    useQuery({
      queryKey: ['admin', key, params],
      queryFn: () => service.getAll(params).then((res) => res.data),
    });

  const useGetById = (id) =>
    useQuery({
      queryKey: ['admin', key, id],
      queryFn: () => service.getById(id).then((res) => res.data.data),
      enabled: !!id,
    });

  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data) => service.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', key] });
        queryClient.invalidateQueries({ queryKey: ['public'] });
        toast.success(`${labels.singular} berhasil dibuat.`);
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }) => service.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', key] });
        queryClient.invalidateQueries({ queryKey: ['public'] });
        toast.success(`${labels.singular} berhasil diperbarui.`);
      },
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id) => service.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', key] });
        queryClient.invalidateQueries({ queryKey: ['public'] });
        toast.success(`${labels.singular} berhasil dihapus.`);
      },
    });
  };

  return { useGetAll, useGetById, useCreate, useUpdate, useDelete };
}

// ─── Users ───────────────────────────────────────
const userHooks = createCrudHooks('users', userService, { singular: 'User' });
export const useUsers = userHooks.useGetAll;
export const useUser = userHooks.useGetById;
export const useCreateUser = userHooks.useCreate;
export const useUpdateUser = userHooks.useUpdate;
export const useDeleteUser = userHooks.useDelete;

export function useResetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newPassword }) => userService.resetPassword(id, newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Password berhasil direset.');
    },
  });
}

// ─── Categories ──────────────────────────────────
const categoryHooks = createCrudHooks('categories', categoryService, { singular: 'Kategori' });
export const useCategories = categoryHooks.useGetAll;
export const useCategory = categoryHooks.useGetById;
export const useCreateCategory = categoryHooks.useCreate;
export const useUpdateCategory = categoryHooks.useUpdate;
export const useDeleteCategory = categoryHooks.useDelete;

// ─── Tags ────────────────────────────────────────
const tagHooks = createCrudHooks('tags', tagService, { singular: 'Tag' });
export const useTags = tagHooks.useGetAll;
export const useTag = tagHooks.useGetById;
export const useCreateTag = tagHooks.useCreate;
export const useUpdateTag = tagHooks.useUpdate;
export const useDeleteTag = tagHooks.useDelete;

// ─── Articles ────────────────────────────────────
const articleHooks = createCrudHooks('articles', articleService, { singular: 'Artikel' });
export const useArticles = articleHooks.useGetAll;
export const useArticle = articleHooks.useGetById;
export const useCreateArticle = articleHooks.useCreate;
export const useUpdateArticle = articleHooks.useUpdate;
export const useDeleteArticle = articleHooks.useDelete;

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => articleService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'articles'] });
      queryClient.invalidateQueries({ queryKey: ['public'] });
      toast.success('Status artikel berhasil diperbarui.');
    },
  });
}

// ─── Programs ────────────────────────────────────
const programHooks = createCrudHooks('programs', programService, { singular: 'Program' });
export const usePrograms = programHooks.useGetAll;
export const useProgram = programHooks.useGetById;
export const useCreateProgram = programHooks.useCreate;
export const useUpdateProgram = programHooks.useUpdate;
export const useDeleteProgram = programHooks.useDelete;

// ─── Gallery ─────────────────────────────────────
const galleryHooks = createCrudHooks('gallery', galleryService, { singular: 'Foto' });
export const useGalleryItems = galleryHooks.useGetAll;
export const useGalleryItem = galleryHooks.useGetById;
export const useCreateGallery = galleryHooks.useCreate;
export const useUpdateGallery = galleryHooks.useUpdate;
export const useDeleteGallery = galleryHooks.useDelete;

// ─── Schedules ───────────────────────────────────
const scheduleHooks = createCrudHooks('schedules', scheduleService, { singular: 'Jadwal' });
export const useSchedules = scheduleHooks.useGetAll;
export const useSchedule = scheduleHooks.useGetById;
export const useCreateSchedule = scheduleHooks.useCreate;
export const useUpdateSchedule = scheduleHooks.useUpdate;
export const useDeleteSchedule = scheduleHooks.useDelete;

// ─── Settings ────────────────────────────────────
export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => settingService.getAll().then((res) => res.data.data),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, logoFile }) => settingService.update(data, logoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'home'] });
      toast.success('Pengaturan berhasil disimpan.');
    },
  });
}

// ─── Composite Hooks (For Admin CRUD Pages) ──────────

export function useAdminUsers(params) {
  const { data, isLoading } = useUsers(params);
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  return { data, isLoading, createUser, updateUser, deleteUser, isCreating, isUpdating, isDeleting };
}

export function useAdminCategories(params) {
  const { data, isLoading } = useCategories(params);
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  return { data, isLoading, createCategory, updateCategory, deleteCategory, isCreating, isUpdating, isDeleting };
}

export function useAdminTags(params) {
  const { data, isLoading } = useTags(params);
  const { mutate: createTag, isPending: isCreating } = useCreateTag();
  const { mutate: updateTag, isPending: isUpdating } = useUpdateTag();
  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTag();
  return { data, isLoading, createTag, updateTag, deleteTag, isCreating, isUpdating, isDeleting };
}

export function useAdminArticles(params) {
  const { data, isLoading } = useArticles(params);
  const { mutate: createArticle, isPending: isCreating } = useCreateArticle();
  const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticle();
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();
  return { data, isLoading, createArticle, updateArticle, deleteArticle, isCreating, isUpdating, isDeleting };
}

export function useAdminPrograms(params) {
  const { data, isLoading } = usePrograms(params);
  const { mutate: createProgram, isPending: isCreating } = useCreateProgram();
  const { mutate: updateProgram, isPending: isUpdating } = useUpdateProgram();
  const { mutate: deleteProgram, isPending: isDeleting } = useDeleteProgram();
  return { data, isLoading, createProgram, updateProgram, deleteProgram, isCreating, isUpdating, isDeleting };
}

export function useAdminGallery(params) {
  const { data, isLoading } = useGalleryItems(params);
  const { mutate: createGallery, isPending: isCreating } = useCreateGallery();
  const { mutate: updateGallery, isPending: isUpdating } = useUpdateGallery();
  const { mutate: deleteGallery, isPending: isDeleting } = useDeleteGallery();
  return { data, isLoading, createGallery, updateGallery, deleteGallery, isCreating, isUpdating, isDeleting };
}

export function useAdminSchedules(params) {
  const { data, isLoading } = useSchedules(params);
  const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule();
  const { mutate: updateSchedule, isPending: isUpdating } = useUpdateSchedule();
  const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteSchedule();
  return { data, isLoading, createSchedule, updateSchedule, deleteSchedule, isCreating, isUpdating, isDeleting };
}

export function useAdminSettingsComposite() {
  const { data, isLoading } = useAdminSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();
  return { data, isLoading, updateSettings, isUpdating };
}
