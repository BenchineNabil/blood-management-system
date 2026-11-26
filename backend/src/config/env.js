import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is missing or too short. Set a random value of 32+ characters in .env');
}

export const env = {
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',

  jwtRememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN || '30d',
  port: Number(process.env.PORT) || 4000,

  dbPath: process.env.DB_PATH || '../database/hemocare.db',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
