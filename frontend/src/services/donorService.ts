// ─── Donor service ────────────────────────────────────────────────────────────
// Maps 1:1 to API endpoints: GET /donors, GET /donors/:id,
// POST /donors, PUT /donors/:id, GET /donors/:id/donations

import { apiRequest } from './apiClient';
import { mockDonorService } from './mockStore';
import type { DonorAPI, DonationAPI } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Mappers (API field names ↔ UI) ──────────────────────────────────────────
// All mapping between snake_case API fields and French UI labels lives here.
export type DonorCreatePayload = Omit<DonorAPI, 'donor_id' | 'created_at'>;

export const donorService = {
  /** GET /donors */
  getAll: (): Promise<DonorAPI[]> =>
    USE_MOCK ? mockDonorService.getAll() : apiRequest<DonorAPI[]>('/donors'),

  /** GET /donors/:donorNumber */
  getById: (donorNumber: number): Promise<DonorAPI | undefined> =>
    USE_MOCK
      ? mockDonorService.getById(donorNumber)
      : apiRequest<DonorAPI>(`/donors/${donorNumber}`),

  /** POST /donors */
  create: (payload: DonorCreatePayload): Promise<DonorAPI> =>
    USE_MOCK
      ? mockDonorService.create(payload)
      : apiRequest<DonorAPI>('/donors', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),

  /** PUT /donors/:donorNumber */
  update: (donorNumber: number, payload: Partial<DonorAPI>): Promise<DonorAPI> =>
    USE_MOCK
      ? mockDonorService.update(donorNumber, payload)
      : apiRequest<DonorAPI>(`/donors/${donorNumber}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }),

  /** GET /donors/:donorNumber/donations */
  getDonations: (donorNumber: number): Promise<DonationAPI[]> =>
    USE_MOCK
      ? mockDonorService.getDonations(donorNumber)
      : apiRequest<DonationAPI[]>(`/donors/${donorNumber}/donations`),
};
