import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';


const ALGORITHM = 'HS256';
const ISSUER = 'hemocare-api';
const AUDIENCE = 'hemocare-app';

export const signToken = (userId, expiresIn) =>
  jwt.sign({}, env.jwtSecret, {
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE,
    subject: String(userId),
    expiresIn,
  });

export const verifyToken = (token) =>
  jwt.verify(token, env.jwtSecret, {
    algorithms: [ALGORITHM],
    issuer: ISSUER,
    audience: AUDIENCE,
  });
