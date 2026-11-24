// ─── Questionnaire service ────────────────────────────────────────────────────
// Maps to: GET /questionnaire, POST /questionnaire/validate

import { apiRequest } from './apiClient';
import { mockQuestionnaireService } from './mockStore';
import type { Question } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface ValidatePayload {
  answers: Record<number, string>;
}

export interface ValidateResponse {
  eligible: boolean;
  details?: Record<number, string>;
}

export const questionnaireService = {
  /** GET /questionnaire */
  getQuestions: (): Promise<Question[]> =>
    USE_MOCK
      ? mockQuestionnaireService.getQuestions()
      : apiRequest<Question[]>('/questionnaire'),

  /** POST /questionnaire/validate */
  validate: (payload: ValidatePayload): Promise<ValidateResponse> =>
    USE_MOCK
      ? mockQuestionnaireService.validate(payload.answers)
      : apiRequest<ValidateResponse>('/questionnaire/validate', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
};
