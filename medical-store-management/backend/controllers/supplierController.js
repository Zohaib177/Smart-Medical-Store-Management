const ApiResponse = require('../utils/ApiResponse'); const asyncHandler = require('../middleware/asyncHandler'); const service = require('../services/supplierService');
const listSuppliers = asyncHandler(async (req, res) => { const result = await service.getSuppliers(req.query); return ApiResponse.paginated(res, { message: 'Suppliers retrieved successfully', data: result.data, pagination: result.pagination }); });
const getSupplierOptions = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Supplier options retrieved successfully', data: await service.getSupplierOptions() }));
const getSupplier = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Supplier retrieved successfully', data: { supplier: await service.getSupplierById(req.params.id) } }));
const createSupplier = asyncHandler(async (req, res) => ApiResponse.created(res, { message: 'Supplier created successfully', data: { supplier: await service.createSupplier(req.body) } }));
const updateSupplier = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Supplier updated successfully', data: { supplier: await service.updateSupplier(req.params.id, req.body) } }));
const updateSupplierStatus = asyncHandler(async (req, res) => ApiResponse.success(res, { message: 'Supplier status updated successfully', data: { supplier: await service.updateSupplierStatus(req.params.id, req.body.status) } }));
const deleteSupplier = asyncHandler(async (req, res) => { await service.deleteSupplier(req.params.id); return ApiResponse.success(res, { message: 'Supplier deleted successfully' }); });
module.exports = { listSuppliers, getSupplierOptions, getSupplier, createSupplier, updateSupplier, updateSupplierStatus, deleteSupplier };
