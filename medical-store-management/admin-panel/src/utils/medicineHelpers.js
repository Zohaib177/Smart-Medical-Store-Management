export const getStockStatusLabel = (status) => ({ inStock: 'In Stock', lowStock: 'Low Stock', outOfStock: 'Out of Stock' }[status] || 'Unknown');
export const getExpiryStatusLabel = (status) => ({ valid: 'Valid', expiringSoon: 'Expiring Soon', expired: 'Expired', unknown: 'No Expiry Date' }[status] || 'Unknown');
export const getMedicineDisplayName = (medicine) => [medicine?.medicineName, medicine?.strength].filter(Boolean).join(' — ');
export function getDaysUntilExpiryText(days) { if (days == null) return 'No expiry date'; if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`; if (days === 0) return 'Expires today'; return `${days} day${days === 1 ? '' : 's'} remaining`; }
export function getMedicineErrorMessage(error, fallback = 'Unable to complete the medicine request.') { return error?.response?.data?.message || fallback; }
export function getMedicineFieldErrors(error) { const errors = error?.response?.data?.errors; return Array.isArray(errors) ? Object.fromEntries(errors.map((item) => [item.field, item.message])) : {}; }
export const getMedicineSortValue = (filters) => `${filters.sortBy}:${filters.sortDirection}`;
export const toDateInput = (value) => value ? String(value).slice(0, 10) : '';
export function buildMedicinePayload(form) {
  const optional = (value) => value.trim() || null;
  return {
    medicineName: form.medicineName.trim(), genericName: optional(form.genericName), categoryId: Number(form.categoryId), companyId: Number(form.companyId),
    batchNumber: optional(form.batchNumber), barcode: optional(form.barcode), description: optional(form.description), dosageForm: optional(form.dosageForm), strength: optional(form.strength),
    purchasePrice: Number(form.purchasePrice), salePrice: Number(form.salePrice), stockQuantity: Number(form.stockQuantity), minimumStock: Number(form.minimumStock),
    manufacturingDate: form.manufacturingDate || null, expiryDate: form.expiryDate || null, imageUrl: optional(form.imageUrl), prescriptionRequired: Boolean(form.prescriptionRequired), status: form.status,
  };
}
