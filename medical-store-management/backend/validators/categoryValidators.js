const { body, param, query } = require('express-validator');

const allowedStatuses = ['active', 'inactive'];
const allowedSortColumns = ['category_name', 'status', 'created_at', 'updated_at'];

const categoryIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('Category id must be a positive integer'),
];

const listCategoriesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().trim().isLength({ max: 100 }).withMessage('Search must not exceed 100 characters'),
  query('status').optional().isIn(allowedStatuses).withMessage('Status must be active or inactive'),
  query('sortBy').optional().isIn(allowedSortColumns).withMessage('Invalid category sort column'),
  query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be asc or desc'),
];

const categoryNameValidator = body('categoryName')
  .exists({ values: 'falsy' }).withMessage('Category name is required')
  .bail()
  .isString().withMessage('Category name must be a string')
  .bail()
  .trim()
  .isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters');

const descriptionValidator = body('description')
  .optional({ nullable: true })
  .isString().withMessage('Description must be a string')
  .bail()
  .trim()
  .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters');

const optionalStatusValidator = body('status')
  .optional()
  .isIn(allowedStatuses).withMessage('Status must be active or inactive');

const createCategoryValidator = [categoryNameValidator, descriptionValidator, optionalStatusValidator];
const updateCategoryValidator = [categoryNameValidator, descriptionValidator, optionalStatusValidator];
const updateCategoryStatusValidator = [
  body('status').exists().withMessage('Status is required').bail().isIn(allowedStatuses).withMessage('Status must be active or inactive'),
];

module.exports = {
  categoryIdValidator,
  listCategoriesValidator,
  createCategoryValidator,
  updateCategoryValidator,
  updateCategoryStatusValidator,
};
