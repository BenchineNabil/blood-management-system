// ─── Bag service ─────────────────────────────────────────────────────────────
// TODO(API): The API document does not define endpoints for blood bags (Registre des poches),
// Sortie (issuing), or expiry management. Using /donations as the closest resource
// (each donation produces one bag per the API notes). These endpoints are marked
// TODO and must be confirmed with the backend team.

import { apiRequest } from './apiClient';
import { mockBagService } from './mockStore';
import type { BagAPI } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export type BagCreatePayload = Omit<BagAPI, 'id'>;

export const bagService = {
  /**
   * TODO(API): No /bags endpoint defined. Using mock only.
   * Backend team should define GET /bags (or GET /donations with bag info).
   */
  getAll: (): Promise<BagAPI[]> =>
    USE_MOCK ? mockBagService.getAll() : apiRequest<BagAPI[]>('/bags'),

  /**
   * TODO(API): No POST /bags endpoint defined.
   * Backend team should define POST /bags (or confirm bags are created via POST /donations).
   */
  create: (payload: BagCreatePayload): Promise<BagAPI> =>
    USE_MOCK
      ? mockBagService.create(payload)
      : apiRequest<BagAPI>('/bags', { method: 'POST', body: JSON.stringify(payload) }),

  /**
   * TODO(API): No PATCH /bags/:id/issue endpoint defined.
   * Backend team should define how to record a Sortie (date + service).
   */
  issue: (id: number, dateSortie: string, service: string): Promise<BagAPI> =>
    USE_MOCK
      ? mockBagService.issue(id, dateSortie, service)
      : apiRequest<BagAPI>(`/bags/${id}/issue`, {
          method: 'PATCH',
          body: JSON.stringify({ dateSortie, service }),
        }),
};
