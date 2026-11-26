import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import { getUserById } from '../services/auth.service.js';

export function requireAuth(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required'));
  }
  try {
    const payload = verifyToken(token);
    const user = getUserById(Number(payload.sub));
    if (!user) throw new Error('user not found');
    req.user = user;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}
