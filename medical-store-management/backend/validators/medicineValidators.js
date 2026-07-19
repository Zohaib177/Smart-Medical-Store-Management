const { body, param, query } = require('express-validator');

const statuses = ['active', 'inactive'];
const sortFields = ['medicine_name', 'generic_name', 'purchase_price', 'sale_price', 'stock_quantity', 'minimum_stock', 'expiry_date', 'status', 'created_at', 'updated_at'];
const optionalString = (field, label, max) => body(field).optional({ nullable: true }).isString().withMessage(`${label} must be a string`).bail().trim().isLength({ max }).withMessage(`${label} must not exceed ${max} characters`);
const medicineIdValidator = [param('id').isInt({ min: 1 }).withMessage('Medicine id must be a positive integer')];
const listMedicinesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'), query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().trim().isLength({ max: 150 }).withMessage('Search must not exceed 150 characters'), query('status').optional().isIn(statuses).withMessage('Status must be active or inactive'),
  query('categoryId').optional().isInt({ min: 1 }).withMessage('Category must be a positive integer'), query('companyId').optional().isInt({ min: 1 }).withMessage('Company must be a positive integer'),
  query('stockStatus').optional().isIn(['inStock', 'lowStock', 'outOfStock']).withMessage('Invalid stock status'), query('expiryStatus').optional().isIn(['valid', 'expiringSoon', 'expired', 'unknown']).withMessage('Invalid expiry status'),
  query('sortBy').optional().isIn(sortFields).withMessage('Invalid medicine sort column'), query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be asc or desc'),
];
const medicineFields = [
  body('medicineName').exists({ values: 'falsy' }).withMessage('Medicine name is required').bail().isString().trim().isLength({ min: 2, max: 150 }).withMessage('Medicine name must be between 2 and 150 characters'),
  optionalString('genericName', 'Generic name', 150), body('categoryId').isInt({ min: 1 }).withMessage('Category is required'), body('companyId').isInt({ min: 1 }).withMessage('Company is required'),
  optionalString('batchNumber', 'Batch number', 100), optionalString('barcode', 'Barcode', 100), optionalString('description', 'Description', 2000), optionalString('dosageForm', 'Dosage form', 100), optionalString('strength', 'Strength', 100),
  body('purchasePrice').isFloat({ min: 0 }).withMessage('Purchase price must be zero or greater').bail().custom((value) => /^\d+(\.\d{1,2})?$/.test(String(value))).withMessage('Purchase price must have at most 2 decimal places'),
  body('salePrice').isFloat({ min: 0 }).withMessage('Sale price must be zero or greater').bail().custom((value) => /^\d+(\.\d{1,2})?$/.test(String(value))).withMessage('Sale price must have at most 2 decimal places'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'), body('minimumStock').isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer'),
  body('manufacturingDate').optional({ nullable: true, checkFalsy: true }).isISO8601({ strict: true }).withMessage('Manufacturing date must be valid'), body('expiryDate').optional({ nullable: true, checkFalsy: true }).isISO8601({ strict: true }).withMessage('Expiry date must be valid'),
  body('imageUrl').optional({ nullable: true, checkFalsy: true }).isString().isLength({ max: 255 }).withMessage('Image URL must not exceed 255 characters').bail().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Image URL must be a valid HTTP or HTTPS URL'),
  body('prescriptionRequired').optional().isBoolean().withMessage('Prescription required must be a boolean').toBoolean(), body('status').optional().isIn(statuses).withMessage('Status must be active or inactive'),
];
const createMedicineValidator = medicineFields;
const updateMedicineValidator = medicineFields;
const updateMedicineStatusValidator = [body('status').exists().withMessage('Status is required').bail().isIn(statuses).withMessage('Status must be active or inactive')];
module.exports = { medicineIdValidator, listMedicinesValidator, createMedicineValidator, updateMedicineValidator, updateMedicineStatusValidator };
