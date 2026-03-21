import { http } from '@/utils/http';
import config from '@/config';
import type { Category } from '@/types';

const { CATEGORIES } = config.ENDPOINTS;

export const categoryService = {
  getAll: (trackerId: string) => http.get<Category[]>(CATEGORIES.GET_ALL(trackerId)),

  create: (data: { name: string; icon?: string; color?: string; subcategories?: string[]; trackerId: string }) =>
    http.post<Category>(CATEGORIES.CREATE, data),

  update: (id: string, data: Partial<Category>) =>
    http.put<Category>(CATEGORIES.UPDATE(id), data),

  delete: (id: string) =>
    http.delete<{ success: boolean; message: string }>(CATEGORIES.DELETE(id)),
};
