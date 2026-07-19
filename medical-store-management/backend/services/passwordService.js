const bcrypt = require('bcryptjs');
const config = require('../config/environment');

async function hashPassword(plainPassword) {
  const saltRounds = Number(config.bcryptSaltRounds || 12);
  return bcrypt.hash(plainPassword, saltRounds);
}

async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

function validatePasswordStrength(password) {
  if (typeof password !== 'string') {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
};
