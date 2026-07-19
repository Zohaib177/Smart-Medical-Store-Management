function normalizeOptionalString(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || null;
}

function normalizeOptionalDate(value) {
  return value ? String(value).slice(0, 10) : null;
}

function getStockStatus(quantity, minimum) {
  if (quantity <= 0) return 'outOfStock';
  if (quantity <= minimum) return 'lowStock';
  return 'inStock';
}

function getExpiryStatus(daysUntilExpiry) {
  if (daysUntilExpiry === null || daysUntilExpiry === undefined) return 'unknown';
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiringSoon';
  return 'valid';
}

function mapMedicineRow(row) {
  if (!row) return null;
  const stockQuantity = Number(row.stock_quantity || 0);
  const minimumStock = Number(row.minimum_stock || 0);
  const daysUntilExpiry = row.days_until_expiry === null || row.days_until_expiry === undefined ? null : Number(row.days_until_expiry);
  return {
    id: row.id,
    medicineName: row.medicine_name,
    genericName: row.generic_name,
    category: { id: row.category_id, categoryName: row.category_name },
    company: { id: row.company_id, companyName: row.company_name },
    barcode: row.barcode,
    batchNumber: row.batch_number,
    strength: row.strength,
    dosageForm: row.dosage_form,
    purchasePrice: Number(row.purchase_price || 0),
    salePrice: Number(row.selling_price || 0),
    stockQuantity,
    minimumStock,
    stockStatus: getStockStatus(stockQuantity, minimumStock),
    expiryDate: row.expiry_date,
    manufacturingDate: row.manufacturing_date,
    expiryStatus: getExpiryStatus(daysUntilExpiry),
    daysUntilExpiry,
    description: row.description,
    imageUrl: row.image,
    prescriptionRequired: Boolean(row.prescription_required),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMedicineInput(input) {
  return {
    medicine_name: String(input.medicineName || '').trim().replace(/\s+/g, ' '),
    generic_name: normalizeOptionalString(input.genericName),
    category_id: Number(input.categoryId),
    company_id: Number(input.companyId),
    barcode: normalizeOptionalString(input.barcode),
    batch_number: normalizeOptionalString(input.batchNumber),
    strength: normalizeOptionalString(input.strength),
    dosage_form: normalizeOptionalString(input.dosageForm),
    purchase_price: Number(input.purchasePrice ?? 0),
    selling_price: Number(input.salePrice ?? 0),
    stock_quantity: Number(input.stockQuantity ?? 0),
    minimum_stock: Number(input.minimumStock ?? 0),
    expiry_date: normalizeOptionalDate(input.expiryDate),
    manufacturing_date: normalizeOptionalDate(input.manufacturingDate),
    description: normalizeOptionalString(input.description),
    image: normalizeOptionalString(input.imageUrl),
    prescription_required: input.prescriptionRequired ? 1 : 0,
    status: input.status || 'active',
  };
}

module.exports = { mapMedicineRow, mapMedicineInput, normalizeOptionalString, normalizeOptionalDate, getStockStatus, getExpiryStatus };
