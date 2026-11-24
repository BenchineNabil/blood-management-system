// ─── Donation service ─────────────────────────────────────────────────────────
// Maps 1:1 to: GET /donations, GET /donations/:id, POST /donations

import { apiRequest } from './apiClient';
import { mockDonationService } from './mockStore';
import type { DonationAPI } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export type DonationCreatePayload = Omit<DonationAPI, 'donation_id'>;

export const donationService = {
  /** GET /donations */
  getAll: (): Promise<DonationAPI[]> =>
    USE_MOCK ? mockDonationService.getAll() : apiRequest<DonationAPI[]>('/donations'),

  /** GET /donations/:id */
  getById: (id: number): Promise<DonationAPI | undefined> =>
    USE_MOCK
      ? mockDonationService.getById(id)
      : apiRequest<DonationAPI>(`/donations/${id}`),

  /** POST /donations */
  create: (payload: DonationCreatePayload): Promise<DonationAPI> =>
    USE_MOCK
      ? mockDonationService.create(payload)
      : apiRequest<DonationAPI>('/donations', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
};
