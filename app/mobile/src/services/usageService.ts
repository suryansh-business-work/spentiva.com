import { http } from '@/utils/http';
import config from '@/config';
import type { UsageOverview } from '@/types';

const { USAGE } = config.ENDPOINTS;

export const usageService = {
  getOverview: () => http.get<UsageOverview>(USAGE.OVERVIEW),

  getGraphs: () => http.get<unknown>(USAGE.GRAPHS),
};
