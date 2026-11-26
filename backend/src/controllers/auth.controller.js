import asyncHandler from '../utils/asyncHandler.js';
import * as auth from '../services/auth.service.js';

export const login = asyncHandler(async (req, res) => {
  const result = await auth.login(req.validated.body);
  res.set('Cache-Control', 'no-store');
  res.json({ data: result });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ data: req.user });
});
