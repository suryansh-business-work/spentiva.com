import { http } from '@/utils/http';
import config from '@/config';
import type { Tracker } from '@/types';

const { TRACKERS } = config.ENDPOINTS;

export const trackerService = {
  getAll: () => http.get<Tracker[]>(TRACKERS.GET_ALL),

  create: (data: { name: string; type: string; description?: string; currency: string }) =>
    http.post<Tracker>(TRACKERS.CREATE, data),

  update: (id: string, data: Partial<Tracker>) =>
    http.put<Tracker>(TRACKERS.UPDATE(id), data),

  delete: (id: string) => http.delete<{ success: boolean; message: string }>(TRACKERS.DELETE(id)),

  share: (id: string, data: { email: string; role: string }) =>
    http.post<{ success: boolean; message: string }>(TRACKERS.SHARE(id), data),

  unshare: (id: string, data: { userId: string }) =>
    http.post<{ success: boolean; message: string }>(TRACKERS.UNSHARE(id), data),
};
