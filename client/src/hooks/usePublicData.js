import { useQuery } from '@tanstack/react-query';
import { publicService } from '../services/publicService';

export function useHomePage() {
  return useQuery({
    queryKey: ['public', 'home'],
    queryFn: () => publicService.getHomePage().then((res) => res.data.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePublicArticles(params = {}) {
  return useQuery({
    queryKey: ['public', 'articles', params],
    queryFn: () => publicService.getArticles(params).then((res) => res.data),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePublicArticle(slug) {
  return useQuery({
    queryKey: ['public', 'article', slug],
    queryFn: () => publicService.getArticleBySlug(slug).then((res) => res.data.data),
    enabled: !!slug,
  });
}

export function usePublicPrograms() {
  return useQuery({
    queryKey: ['public', 'programs'],
    queryFn: () => publicService.getPrograms().then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicGallery(params = {}) {
  return useQuery({
    queryKey: ['public', 'gallery', params],
    queryFn: () => publicService.getGallery(params).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicSchedules() {
  return useQuery({
    queryKey: ['public', 'schedules'],
    queryFn: () => publicService.getSchedules().then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: ['public', 'categories'],
    queryFn: () => publicService.getCategories().then((res) => res.data.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePublicTags() {
  return useQuery({
    queryKey: ['public', 'tags'],
    queryFn: () => publicService.getTags().then((res) => res.data.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => publicService.getSettings().then((res) => res.data.data),
    staleTime: 1000 * 60 * 10,
  });
}
