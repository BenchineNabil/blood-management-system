// ─── Stats service ────────────────────────────────────────────────────────────
// TODO(API): No /stats endpoint defined in the API document.
// Statistics are computed client-side from bags data in mock mode.
// Backend team should define GET /stats?du=...&au=... if server-side aggregation is needed.

import { mockStatsService } from './mockStore';
import type { StatsResponse } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const statsService = {
  get: (du: string, au: string): Promise<StatsResponse> =>
    USE_MOCK
      ? mockStatsService.get(du, au)
      : Promise.resolve({ parService: [], parSite: [], parSiteEtSexe: [] }), // TODO(API): no endpoint
};
