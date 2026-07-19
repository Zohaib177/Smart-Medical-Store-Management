const dotenv = require('dotenv');

dotenv.config();

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function requireEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toList(value, fallback) {
  return String(value || fallback)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const clientUrls = toList(process.env.CLIENT_URLS || process.env.CLIENT_URL, 'http://localhost:5173');

const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  clientUrl: clientUrls[0],
  clientUrls: Object.freeze(clientUrls),
  database: Object.freeze({
    host: requireEnv('DB_HOST'),
    port: toNumber(process.env.DB_PORT, 3306),
    user: requireEnv('DB_USER'),
    password: process.env.DB_PASSWORD || '',
    name: requireEnv('DB_NAME'),
    connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  }),
  apiPrefix: process.env.API_PREFIX || '/api',
  jwtSecret: process.env.JWT_SECRET || 'medical-store-dev-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'medical-store-dev-refresh-secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptSaltRounds: toNumber(process.env.BCRYPT_SALT_ROUNDS, 12),
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
});

module.exports = config;
