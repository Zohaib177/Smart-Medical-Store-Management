const ApiError = require('../utils/ApiError');
const MedicineCompany = require('../models/MedicineCompany');

function normalizeText(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || null;
}

function normalizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function normalizeEmail(value) {
  const normalized = normalizeText(value);
  return normalized ? normalized.toLowerCase() : null;
}

async function getCompanies(query) {
  try {
    return await MedicineCompany.findAllWithMedicineCount(query);
  } catch (error) {
    throw new ApiError(500, 'Unable to retrieve companies', 'INTERNAL_SERVER_ERROR');
  }
}

async function getCompanyById(id) {
  let company;
  try {
    company = await MedicineCompany.findByIdWithMedicineCount(id);
  } catch (error) {
    throw new ApiError(500, 'Unable to retrieve company', 'INTERNAL_SERVER_ERROR');
  }
  if (!company) throw new ApiError(404, 'Company not found', 'COMPANY_NOT_FOUND');
  return company;
}

async function createCompany(data) {
  const companyName = normalizeName(data.companyName);
  try {
    if (await MedicineCompany.existsByNameInsensitive(companyName)) {
      throw new ApiError(409, 'A company with this name already exists', 'COMPANY_ALREADY_EXISTS');
    }
    return await MedicineCompany.createCompany({
      company_name: companyName, contact_person: normalizeText(data.contactPerson),
      email: normalizeEmail(data.email), phone: normalizeText(data.phone),
      address: normalizeText(data.address), status: data.status || 'active',
    });
  } catch (error) {
    if (error.errorCode === 'COMPANY_ALREADY_EXISTS') throw error;
    throw new ApiError(500, 'Unable to create company', 'COMPANY_CREATE_FAILED');
  }
}

async function updateCompany(id, data) {
  const companyName = normalizeName(data.companyName);
  try {
    const existing = await getCompanyById(id);
    if (await MedicineCompany.existsByNameInsensitive(companyName, id)) {
      throw new ApiError(409, 'A company with this name already exists', 'COMPANY_ALREADY_EXISTS');
    }
    return await MedicineCompany.updateCompany(id, {
      company_name: companyName, contact_person: normalizeText(data.contactPerson),
      email: normalizeEmail(data.email), phone: normalizeText(data.phone),
      address: normalizeText(data.address), status: data.status || existing.status,
    });
  } catch (error) {
    if (['COMPANY_NOT_FOUND', 'COMPANY_ALREADY_EXISTS'].includes(error.errorCode)) throw error;
    throw new ApiError(500, 'Unable to update company', 'COMPANY_UPDATE_FAILED');
  }
}

async function updateCompanyStatus(id, status) {
  try {
    await getCompanyById(id);
    return await MedicineCompany.updateStatus(id, status);
  } catch (error) {
    if (error.errorCode === 'COMPANY_NOT_FOUND') throw error;
    throw new ApiError(500, 'Unable to update company', 'COMPANY_UPDATE_FAILED');
  }
}

async function deleteCompany(id) {
  try {
    await getCompanyById(id);
    if (await MedicineCompany.getMedicineCount(id) > 0) {
      throw new ApiError(409, 'This company cannot be deleted because medicines are linked to it', 'COMPANY_IN_USE');
    }
    await MedicineCompany.deleteCompany(id);
  } catch (error) {
    if (['COMPANY_NOT_FOUND', 'COMPANY_IN_USE'].includes(error.errorCode)) throw error;
    throw new ApiError(500, 'Unable to delete company', 'COMPANY_DELETE_FAILED');
  }
}

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, updateCompanyStatus, deleteCompany };
