const { param, query } = require('express-validator');

const idParam = param('id').isInt({ min: 1 }).withMessage('A valid id is required');

const pageQuery = query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer');

const limitQuery = query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer');

const emailValidator = (fieldName = 'email') =>
  (fieldName === 'email' ? query(fieldName) : query(fieldName))
    .optional({ nullable: true })
    .isEmail()
    .withMessage('A valid email is required');

const phoneValidator = (fieldName = 'phone') =>
  query(fieldName).optional({ nullable: true }).isString().isLength({ min: 5 }).withMessage('A valid phone number is required');

const statusValidator = (fieldName = 'status') =>
  query(fieldName).optional({ nullable: true }).isIn(['active', 'inactive', 'blocked']).withMessage('Invalid status');

module.exports = {
  idParam,
  pageQuery,
  limitQuery,
  emailValidator,
  phoneValidator,
  statusValidator,
};
