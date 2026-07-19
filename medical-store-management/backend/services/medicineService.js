const ApiError = require('../utils/ApiError');
const Medicine = require('../models/Medicine');
const categoryService = require('./categoryService');
const companyService = require('./companyService');
const { mapMedicineInput } = require('../utils/medicineMapper');

const businessCodes = new Set(['MEDICINE_NOT_FOUND', 'MEDICINE_BARCODE_EXISTS', 'MEDICINE_IN_USE', 'INVALID_CATEGORY', 'CATEGORY_INACTIVE', 'INVALID_COMPANY', 'COMPANY_INACTIVE', 'INVALID_PRICE_RANGE', 'INVALID_EXPIRY_DATE']);
const dateOnly = (value) => value ? String(value).slice(0, 10) : null;
function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

async function validateRelations(categoryId, companyId) {
  let category;
  try { category = await categoryService.getCategoryById(categoryId); }
  catch (error) { if (error.errorCode === 'CATEGORY_NOT_FOUND') throw new ApiError(422, 'Selected category does not exist', 'INVALID_CATEGORY'); throw error; }
  if (category.status !== 'active') throw new ApiError(422, 'Selected category is inactive', 'CATEGORY_INACTIVE');
  let company;
  try { company = await companyService.getCompanyById(companyId); }
  catch (error) { if (error.errorCode === 'COMPANY_NOT_FOUND') throw new ApiError(422, 'Selected company does not exist', 'INVALID_COMPANY'); throw error; }
  if (company.status !== 'active') throw new ApiError(422, 'Selected company is inactive', 'COMPANY_INACTIVE');
}

function validateBusinessData(data, existing = null) {
  if (Number(data.salePrice) < Number(data.purchasePrice)) throw new ApiError(422, 'Sale price cannot be lower than purchase price', 'INVALID_PRICE_RANGE');
  const manufacturing = data.manufacturingDate ? dateOnly(data.manufacturingDate) : null;
  const expiry = data.expiryDate ? dateOnly(data.expiryDate) : null;
  if (manufacturing && expiry && expiry <= manufacturing) throw new ApiError(422, 'Expiry date must be after manufacturing date', 'INVALID_EXPIRY_DATE');
  const today = localToday();
  if (expiry && expiry < today) {
    const unchangedExpiredDate = existing && dateOnly(existing.expiryDate) === expiry;
    if (!unchangedExpiredDate) throw new ApiError(422, 'A new expiry date cannot already be expired', 'INVALID_EXPIRY_DATE');
  }
}

async function getMedicines(query) {
  try { return await Medicine.findAllWithRelations(query); }
  catch (error) { throw new ApiError(500, 'Unable to retrieve medicines', 'INTERNAL_SERVER_ERROR'); }
}
async function getMedicineOptions() {
  try { const options = await Medicine.getActiveOptions(); return { ...options, statuses: ['active', 'inactive'] }; }
  catch (error) { throw new ApiError(500, 'Unable to retrieve medicine form options', 'INTERNAL_SERVER_ERROR'); }
}
async function getMedicineById(id) {
  let medicine;
  try { medicine = await Medicine.findByIdWithRelations(id); }
  catch (error) { throw new ApiError(500, 'Unable to retrieve medicine', 'INTERNAL_SERVER_ERROR'); }
  if (!medicine) throw new ApiError(404, 'Medicine not found', 'MEDICINE_NOT_FOUND');
  return medicine;
}
async function createMedicine(data) {
  try {
    await validateRelations(data.categoryId, data.companyId);
    validateBusinessData(data);
    const input = mapMedicineInput(data);
    if (await Medicine.existsByBarcode(input.barcode)) throw new ApiError(409, 'A medicine with this barcode already exists', 'MEDICINE_BARCODE_EXISTS');
    return await Medicine.createMedicine(input);
  } catch (error) {
    if (businessCodes.has(error.errorCode)) throw error;
    throw new ApiError(500, 'Unable to create medicine', 'MEDICINE_CREATE_FAILED');
  }
}
async function updateMedicine(id, data) {
  try {
    const existing = await getMedicineById(id);
    await validateRelations(data.categoryId, data.companyId);
    validateBusinessData(data, existing);
    const input = mapMedicineInput(data);
    if (await Medicine.existsByBarcode(input.barcode, id)) throw new ApiError(409, 'A medicine with this barcode already exists', 'MEDICINE_BARCODE_EXISTS');
    return await Medicine.updateMedicine(id, input);
  } catch (error) {
    if (businessCodes.has(error.errorCode)) throw error;
    throw new ApiError(500, 'Unable to update medicine', 'MEDICINE_UPDATE_FAILED');
  }
}
async function updateMedicineStatus(id, status) {
  try { await getMedicineById(id); return await Medicine.updateStatus(id, status); }
  catch (error) { if (error.errorCode === 'MEDICINE_NOT_FOUND') throw error; throw new ApiError(500, 'Unable to update medicine', 'MEDICINE_UPDATE_FAILED'); }
}
async function deleteMedicine(id) {
  try {
    await getMedicineById(id);
    const usage = await Medicine.getUsageCounts(id);
    if (Number(usage.purchases) + Number(usage.sales) + Number(usage.inventoryLogs) > 0) throw new ApiError(409, 'This medicine cannot be deleted because transaction records are linked to it', 'MEDICINE_IN_USE');
    await Medicine.deleteMedicine(id);
  } catch (error) {
    if (['MEDICINE_NOT_FOUND', 'MEDICINE_IN_USE'].includes(error.errorCode)) throw error;
    throw new ApiError(500, 'Unable to delete medicine', 'MEDICINE_DELETE_FAILED');
  }
}

module.exports = { getMedicines, getMedicineOptions, getMedicineById, createMedicine, updateMedicine, updateMedicineStatus, deleteMedicine };
