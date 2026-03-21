import { http } from '@/utils/http';
import config from '@/config';
import type { SupportTicket } from '@/types';

const { SUPPORT } = config.ENDPOINTS;

export const supportService = {
  getAll: () => http.get<SupportTicket[]>(SUPPORT.GET_ALL),

  getById: (id: string) => http.get<SupportTicket>(SUPPORT.GET_BY_ID(id)),

  create: (data: { type: string; subject: string; description: string; attachments?: string[] }) =>
    http.post<SupportTicket>(SUPPORT.CREATE, data),
};
