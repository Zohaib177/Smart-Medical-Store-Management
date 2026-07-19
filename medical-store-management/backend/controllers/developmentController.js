const ApiResponse = require('../utils/ApiResponse');
const Admin = require('../models/Admin');
const MedicineCategory = require('../models/MedicineCategory');
const MedicineCompany = require('../models/MedicineCompany');
const Medicine = require('../models/Medicine');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const Purchase = require('../models/Purchase');
const Sale = require('../models/Sale');
const InventoryLog = require('../models/InventoryLog');
const SystemSetting = require('../models/SystemSetting');
const asyncHandler = require('../middleware/asyncHandler');

const getDatabaseSummary = asyncHandler(async (req, res) => {
  const [admins, categories, companies, medicines, suppliers, customers, purchases, sales, inventoryLogs] = await Promise.all([
    Admin.count(),
    MedicineCategory.count(),
    MedicineCompany.count(),
    Medicine.count(),
    Supplier.count(),
    Customer.count(),
    Purchase.count(),
    Sale.count(),
    InventoryLog.count(),
  ]);

  return ApiResponse.success(res, {
    message: 'Database summary retrieved successfully',
    data: {
      admins,
      medicineCategories: categories,
      medicineCompanies: companies,
      medicines,
      suppliers,
      customers,
      purchases,
      sales,
      inventoryLogs,
    },
  });
});

const getStoreSettings = asyncHandler(async (req, res) => {
  const settings = await SystemSetting.getStoreSettings();
  return ApiResponse.success(res, {
    message: 'Store settings retrieved successfully',
    data: settings || {},
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const result = await MedicineCategory.findAll({ page, limit });
  return ApiResponse.paginated(res, {
    message: 'Categories retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

const getCompanies = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const result = await MedicineCompany.findAll({ page, limit });
  return ApiResponse.paginated(res, {
    message: 'Companies retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

module.exports = {
  getDatabaseSummary,
  getStoreSettings,
  getCategories,
  getCompanies,
};
