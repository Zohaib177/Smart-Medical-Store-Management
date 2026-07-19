const ApiError = require('../utils/ApiError');
const MedicineCategory = require('../models/MedicineCategory');

function normalizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function normalizeDescription(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || null;
}

async function getCategories(query) {
  try {
    return await MedicineCategory.findAllWithMedicineCount(query);
  } catch (error) {
    throw new ApiError(500, 'Unable to retrieve categories', 'INTERNAL_SERVER_ERROR');
  }
}

async function getCategoryById(id) {
  let category;
  try {
    category = await MedicineCategory.findByIdWithMedicineCount(id);
  } catch (error) {
    throw new ApiError(500, 'Unable to retrieve category', 'INTERNAL_SERVER_ERROR');
  }
  if (!category) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
  return category;
}

async function createCategory(data) {
  const categoryName = normalizeName(data.categoryName);
  try {
    if (await MedicineCategory.existsByNameInsensitive(categoryName)) {
      throw new ApiError(409, 'A category with this name already exists', 'CATEGORY_ALREADY_EXISTS');
    }
    return await MedicineCategory.createCategory({
      category_name: categoryName,
      description: normalizeDescription(data.description),
      status: data.status || 'active',
    });
  } catch (error) {
    if (error.errorCode === 'CATEGORY_ALREADY_EXISTS') throw error;
    throw new ApiError(500, 'Unable to create category', 'CATEGORY_CREATE_FAILED');
  }
}

async function updateCategory(id, data) {
  const categoryName = normalizeName(data.categoryName);
  try {
    const existing = await getCategoryById(id);
    if (await MedicineCategory.existsByNameInsensitive(categoryName, id)) {
      throw new ApiError(409, 'A category with this name already exists', 'CATEGORY_ALREADY_EXISTS');
    }
    return await MedicineCategory.updateCategory(id, {
      category_name: categoryName,
      description: normalizeDescription(data.description),
      status: data.status || existing.status,
    });
  } catch (error) {
    if (['CATEGORY_NOT_FOUND', 'CATEGORY_ALREADY_EXISTS'].includes(error.errorCode)) throw error;
    throw new ApiError(500, 'Unable to update category', 'CATEGORY_UPDATE_FAILED');
  }
}

async function updateCategoryStatus(id, status) {
  try {
    await getCategoryById(id);
    return await MedicineCategory.updateStatus(id, status);
  } catch (error) {
    if (error.errorCode === 'CATEGORY_NOT_FOUND') throw error;
    throw new ApiError(500, 'Unable to update category', 'CATEGORY_UPDATE_FAILED');
  }
}

async function deleteCategory(id) {
  try {
    await getCategoryById(id);
    if (await MedicineCategory.getMedicineCount(id) > 0) {
      throw new ApiError(409, 'This category cannot be deleted because medicines are linked to it', 'CATEGORY_IN_USE');
    }
    await MedicineCategory.deleteCategory(id);
  } catch (error) {
    if (['CATEGORY_NOT_FOUND', 'CATEGORY_IN_USE'].includes(error.errorCode)) throw error;
    throw new ApiError(500, 'Unable to delete category', 'CATEGORY_DELETE_FAILED');
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};
