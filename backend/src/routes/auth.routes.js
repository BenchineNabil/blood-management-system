import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import validate from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import * as c from '../controllers/auth.controller.js';

const router = Router();


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in a few minutes.' },
});

const loginBody = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
  rememberMe: z.boolean().optional().default(false),
});

router.post('/login', loginLimiter, validate({ body: loginBody }), c.login);
router.get('/me', requireAuth, c.me);

export default router;
