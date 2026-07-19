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

const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  database: Object.freeze({
    host: requireEnv('DB_HOST'),
    port: toNumber(process.env.DB_PORT, 3306),
    user: requireEnv('DB_USER'),
    password: process.env.DB_PASSWORD || '',
    name: requireEnv('DB_NAME'),
    connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  }),
  apiPrefix: process.env.API_PREFIX || '/api',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
});

module.exports = config;
