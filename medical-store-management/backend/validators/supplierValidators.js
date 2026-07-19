const { body, param, query } = require('express-validator');
const phonePattern = /^[0-9+()\-\s]*$/;
const supplierIdValidator = [param('id').isInt({ min: 1 }).withMessage('Supplier id must be a positive integer')];
const allowedSorts = ['supplier_name', 'contact_person', 'email', 'phone', 'city', 'status', 'created_at', 'updated_at', 'purchase_count', 'total_purchase_amount'];
const listSuppliersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().trim().isLength({ max: 150 }).withMessage('Search must not exceed 150 characters'),
  query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  query('city').optional().isString().trim().isLength({ max: 100 }).withMessage('City must not exceed 100 characters'),
  query('sortBy').optional().isIn(allowedSorts).withMessage('Invalid supplier sort column'),
  query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be asc or desc'),
];
const optionalText = (field, label, max) => body(field).optional({ nullable: true }).isString().withMessage(`${label} must be a string`).bail().trim().isLength({ max }).withMessage(`${label} must not exceed ${max} characters`);
const supplierFields = [
  body('supplierName').exists({ values: 'falsy' }).withMessage('Supplier name is required').bail().isString().trim().isLength({ min: 2, max: 150 }).withMessage('Supplier name must be between 2 and 150 characters'),
  optionalText('contactPerson', 'Contact person', 120),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Email must be valid').bail().normalizeEmail().isLength({ max: 150 }).withMessage('Email must not exceed 150 characters'),
  body('phone').optional({ nullable: true, checkFalsy: true }).isString().trim().isLength({ max: 30 }).withMessage('Phone must not exceed 30 characters').bail().matches(phonePattern).withMessage('Phone contains invalid characters'),
  optionalText('address', 'Address', 1000), optionalText('city', 'City', 100), optionalText('country', 'Country', 100),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  body('currentBalance').not().exists().withMessage('Current balance cannot be changed directly'),
];
const createSupplierValidator = supplierFields;
const updateSupplierValidator = supplierFields;
const updateSupplierStatusValidator = [body('status').exists().withMessage('Status is required').bail().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')];
module.exports = { supplierIdValidator, listSuppliersValidator, createSupplierValidator, updateSupplierValidator, updateSupplierStatusValidator };
