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
function useCrudHooks(key, service, labels) {
  const queryClient = useQueryClient();

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

  const useCreate = () =>
    useMutation({
      mutationFn: (data) => service.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', key] });
        queryClient.invalidateQueries({ queryKey: ['public'] });
        toast.success(`${labels.singular} berhasil dibuat.`);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: ({ id, data }) => service.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', key] });
        queryClient.invalidateQueries({ queryKey: ['public'] });
        toast.success(`${labels.singular} berhasil diperbarui.`);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id) => service.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', key] });
        queryClient.invalidateQueries({ queryKey: ['public'] });
        toast.success(`${labels.singular} berhasil dihapus.`);
      },
    });

  return { useGetAll, useGetById, useCreate, useUpdate, useDelete };
}

// ─── Users ───────────────────────────────────────
const userHooks = useCrudHooks('users', userService, { singular: 'User' });
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
const categoryHooks = useCrudHooks('categories', categoryService, { singular: 'Kategori' });
export const useCategories = categoryHooks.useGetAll;
export const useCategory = categoryHooks.useGetById;
export const useCreateCategory = categoryHooks.useCreate;
export const useUpdateCategory = categoryHooks.useUpdate;
export const useDeleteCategory = categoryHooks.useDelete;

// ─── Tags ────────────────────────────────────────
const tagHooks = useCrudHooks('tags', tagService, { singular: 'Tag' });
export const useTags = tagHooks.useGetAll;
export const useTag = tagHooks.useGetById;
export const useCreateTag = tagHooks.useCreate;
export const useUpdateTag = tagHooks.useUpdate;
export const useDeleteTag = tagHooks.useDelete;

// ─── Articles ────────────────────────────────────
const articleHooks = useCrudHooks('articles', articleService, { singular: 'Artikel' });
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
const programHooks = useCrudHooks('programs', programService, { singular: 'Program' });
export const usePrograms = programHooks.useGetAll;
export const useProgram = programHooks.useGetById;
export const useCreateProgram = programHooks.useCreate;
export const useUpdateProgram = programHooks.useUpdate;
export const useDeleteProgram = programHooks.useDelete;

// ─── Gallery ─────────────────────────────────────
const galleryHooks = useCrudHooks('gallery', galleryService, { singular: 'Foto' });
export const useGalleryItems = galleryHooks.useGetAll;
export const useGalleryItem = galleryHooks.useGetById;
export const useCreateGallery = galleryHooks.useCreate;
export const useUpdateGallery = galleryHooks.useUpdate;
export const useDeleteGallery = galleryHooks.useDelete;

// ─── Schedules ───────────────────────────────────
const scheduleHooks = useCrudHooks('schedules', scheduleService, { singular: 'Jadwal' });
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
