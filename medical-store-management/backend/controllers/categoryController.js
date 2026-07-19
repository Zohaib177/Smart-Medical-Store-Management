const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const categoryService = require('../services/categoryService');

const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query);
  return ApiResponse.paginated(res, {
    message: 'Categories retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return ApiResponse.success(res, { message: 'Category retrieved successfully', data: { category } });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return ApiResponse.created(res, { message: 'Category created successfully', data: { category } });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return ApiResponse.success(res, { message: 'Category updated successfully', data: { category } });
});

const updateCategoryStatus = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategoryStatus(req.params.id, req.body.status);
  return ApiResponse.success(res, { message: 'Category status updated successfully', data: { category } });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return ApiResponse.success(res, { message: 'Category deleted successfully' });
});

module.exports = { listCategories, getCategory, createCategory, updateCategory, updateCategoryStatus, deleteCategory };
