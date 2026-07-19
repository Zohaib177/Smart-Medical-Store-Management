const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/environment');

function signAccessToken(admin) {
  const payload = {
    sub: admin.id,
    email: admin.email,
    role: admin.role || 'admin',
    type: 'access',
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiresIn || '15m',
  });
}

function signRefreshToken(admin) {
  const payload = {
    sub: admin.id,
    email: admin.email,
    role: admin.role || 'admin',
    type: 'refresh',
    jti: crypto.randomUUID(),
  };

  return jwt.sign(payload, config.jwtRefreshSecret || config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiresIn || '7d',
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwtRefreshSecret || config.jwtSecret);
}

function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
