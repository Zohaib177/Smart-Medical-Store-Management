const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const medicineService = require('../services/medicineService');

const listMedicines = asyncHandler(async (req, res) => { const result = await medicineService.getMedicines(req.query); return ApiResponse.paginated(res, { message: 'Medicines retrieved successfully', data: result.data, pagination: result.pagination }); });
const getMedicineOptions = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Medicine form options retrieved successfully', data: await medicineService.getMedicineOptions() }));
const getMedicine = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Medicine retrieved successfully', data: { medicine: await medicineService.getMedicineById(req.params.id) } }));
const createMedicine = asyncHandler(async (req, res) => ApiResponse.created(res, { message: 'Medicine created successfully', data: { medicine: await medicineService.createMedicine(req.body) } }));
const updateMedicine = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Medicine updated successfully', data: { medicine: await medicineService.updateMedicine(req.params.id, req.body) } }));
const updateMedicineStatus = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Medicine status updated successfully', data: { medicine: await medicineService.updateMedicineStatus(req.params.id, req.body.status) } }));
const deleteMedicine = asyncHandler(async (req, res) => { await medicineService.deleteMedicine(req.params.id); return ApiResponse.success(res, { message: 'Medicine deleted successfully' }); });

module.exports = { listMedicines, getMedicineOptions, getMedicine, createMedicine, updateMedicine, updateMedicineStatus, deleteMedicine };
