const { body, cookie } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshValidator = [
  cookie('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

const logoutValidator = [
  cookie('refreshToken').optional({ nullable: true }).isString().withMessage('Refresh token must be a string'),
];

module.exports = {
  loginValidator,
  refreshValidator,
  logoutValidator,
};
