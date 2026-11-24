// ─── Settings service ─────────────────────────────────────────────────────────
// TODO(API): No /settings endpoint defined in the API document.
// Settings (e.g. shelf life duration) are managed client-side in localStorage.
// Backend team should define GET/PUT /settings if server-side persistence is needed.

import { mockSettingsService } from './mockStore';
import type { Settings } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const settingsService = {
  get: (): Promise<Settings> =>
    USE_MOCK
      ? mockSettingsService.get()
      : Promise.resolve({ dureePeremptionJours: 35 }), // TODO(API): no endpoint

  update: (data: Settings): Promise<Settings> =>
    USE_MOCK
      ? mockSettingsService.update(data)
      : Promise.resolve(data), // TODO(API): no endpoint
};
