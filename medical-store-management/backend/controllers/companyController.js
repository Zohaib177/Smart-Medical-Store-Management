const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const companyService = require('../services/companyService');

const listCompanies = asyncHandler(async (req, res) => {
  const result = await companyService.getCompanies(req.query);
  return ApiResponse.paginated(res, { message: 'Companies retrieved successfully', data: result.data, pagination: result.pagination });
});
const getCompany = asyncHandler(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  return ApiResponse.success(res, { message: 'Company retrieved successfully', data: { company } });
});
const createCompany = asyncHandler(async (req, res) => {
  const company = await companyService.createCompany(req.body);
  return ApiResponse.created(res, { message: 'Company created successfully', data: { company } });
});
const updateCompany = asyncHandler(async (req, res) => {
  const company = await companyService.updateCompany(req.params.id, req.body);
  return ApiResponse.success(res, { message: 'Company updated successfully', data: { company } });
});
const updateCompanyStatus = asyncHandler(async (req, res) => {
  const company = await companyService.updateCompanyStatus(req.params.id, req.body.status);
  return ApiResponse.success(res, { message: 'Company status updated successfully', data: { company } });
});
const deleteCompany = asyncHandler(async (req, res) => {
  await companyService.deleteCompany(req.params.id);
  return ApiResponse.success(res, { message: 'Company deleted successfully' });
});

module.exports = { listCompanies, getCompany, createCompany, updateCompany, updateCompanyStatus, deleteCompany };
