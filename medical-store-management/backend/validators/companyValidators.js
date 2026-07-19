const { body, param, query } = require('express-validator');

const statuses = ['active', 'inactive'];
const sortColumns = ['company_name', 'contact_person', 'email', 'phone', 'status', 'created_at', 'updated_at'];

const companyIdValidator = [param('id').isInt({ min: 1 }).withMessage('Company id must be a positive integer')];
const listCompaniesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().trim().isLength({ max: 150 }).withMessage('Search must not exceed 150 characters'),
  query('status').optional().isIn(statuses).withMessage('Status must be active or inactive'),
  query('sortBy').optional().isIn(sortColumns).withMessage('Invalid company sort column'),
  query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be asc or desc'),
];

const companyName = body('companyName').exists({ values: 'falsy' }).withMessage('Company name is required').bail().isString().withMessage('Company name must be a string').bail().trim().isLength({ min: 2, max: 150 }).withMessage('Company name must be between 2 and 150 characters');
const contactPerson = body('contactPerson').optional({ nullable: true }).isString().withMessage('Contact person must be a string').bail().trim().isLength({ max: 120 }).withMessage('Contact person must not exceed 120 characters');
const email = body('email').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Email must be a string').bail().trim().isLength({ max: 150 }).withMessage('Email must not exceed 150 characters').bail().isEmail().withMessage('Enter a valid email address').normalizeEmail();
const phone = body('phone').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Phone must be a string').bail().trim().isLength({ max: 30 }).withMessage('Phone must not exceed 30 characters').bail().matches(/^[0-9+()\-\s]+$/).withMessage('Phone contains unsupported characters');
const address = body('address').optional({ nullable: true }).isString().withMessage('Address must be a string').bail().trim().isLength({ max: 1000 }).withMessage('Address must not exceed 1000 characters');
const status = body('status').optional().isIn(statuses).withMessage('Status must be active or inactive');

const createCompanyValidator = [companyName, contactPerson, email, phone, address, status];
const updateCompanyValidator = [companyName, contactPerson, email, phone, address, status];
const updateCompanyStatusValidator = [body('status').exists().withMessage('Status is required').bail().isIn(statuses).withMessage('Status must be active or inactive')];

module.exports = { companyIdValidator, listCompaniesValidator, createCompanyValidator, updateCompanyValidator, updateCompanyStatusValidator };
