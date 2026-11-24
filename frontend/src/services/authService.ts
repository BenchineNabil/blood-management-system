// ─── Auth service ─────────────────────────────────────────────────────────────
// TODO(API): No authentication endpoints are defined in the API document.
// The backend README mentions an Authentication module. Using mock auth
// (localStorage token) until real endpoints are confirmed.
//
// When the backend provides auth endpoints, replace MOCK_USERS and the
// mock implementation with real API calls to e.g. POST /auth/login.

import { apiRequest } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Infirmier' | 'Gestionnaire';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// ─── Mock users (for VITE_USE_MOCK=true) ─────────────────────────────────────
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: 1, name: 'Elena Gilbert', email: 'elena@hemocare.dz', password: 'admin123', role: 'Admin' },
  { id: 2, name: 'Karim Mansouri', email: 'karim@hemocare.dz', password: 'infirmier', role: 'Infirmier' },
  { id: 3, name: 'Nadia Belkhir', email: 'nadia@hemocare.dz', password: 'gestion', role: 'Gestionnaire' },
];

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === payload.email && u.password === payload.password,
      );
      if (!user) {
        reject(new Error('INVALID_CREDENTIALS'));
        return;
      }
      const { password: _pw, ...safeUser } = user;
      const token = `mock_token_${safeUser.id}_${Date.now()}`;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
      resolve({ token, user: safeUser });
    }, 400);
  });
}

export const authService = {
  /** POST /auth/login — TODO(API): endpoint not yet defined */
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    USE_MOCK
      ? mockLogin(payload)
      : apiRequest<LoginResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): AuthUser | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};
