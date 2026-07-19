const express = require('express');
const authenticateAdmin = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const categoryController = require('../controllers/categoryController');
const {
  categoryIdValidator,
  listCategoriesValidator,
  createCategoryValidator,
  updateCategoryValidator,
  updateCategoryStatusValidator,
} = require('../validators/categoryValidators');

const router = express.Router();

router.use(authenticateAdmin);
router.get('/', listCategoriesValidator, validateRequest, categoryController.listCategories);
router.get('/:id', categoryIdValidator, validateRequest, categoryController.getCategory);
router.post('/', createCategoryValidator, validateRequest, categoryController.createCategory);
router.put('/:id', categoryIdValidator, updateCategoryValidator, validateRequest, categoryController.updateCategory);
router.patch('/:id/status', categoryIdValidator, updateCategoryStatusValidator, validateRequest, categoryController.updateCategoryStatus);
router.delete('/:id', categoryIdValidator, validateRequest, categoryController.deleteCategory);

module.exports = router;
