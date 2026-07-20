const { getStockStatus, getExpiryStatus } = require('./medicineMapper');
const fromDb = { stock_in: 'stockIn', stock_out: 'stockOut', correction: 'correction', adjustment: 'correction', purchase: 'purchase', return: 'purchaseCancellation' };
const toDb = { stockIn: 'stock_in', stockOut: 'stock_out', correction: 'correction', purchase: 'purchase', purchaseCancellation: 'return' };
const mapTransactionTypeFromDatabase = (value) => fromDb[value] || value;
const mapTransactionTypeToDatabase = (value) => toDb[value] || null;
function mapInventoryMedicineRow(row) {
  const stock = Number(row.stock_quantity || 0); const minimum = Number(row.minimum_stock || 0); const days = row.days_until_expiry == null ? null : Number(row.days_until_expiry); const purchase = Number(row.purchase_price || 0);
  return { medicineId: row.id, medicineName: row.medicine_name, genericName: row.generic_name, category: { id: row.category_id, categoryName: row.category_name }, company: { id: row.company_id, companyName: row.company_name }, batchNumber: row.batch_number, barcode: row.barcode, purchasePrice: purchase, salePrice: Number(row.selling_price || 0), stockQuantity: stock, minimumStock: minimum, stockStatus: getStockStatus(stock, minimum), expiryDate: row.expiry_date, expiryStatus: getExpiryStatus(days), daysUntilExpiry: days, inventoryValue: Number((stock * purchase).toFixed(2)), status: row.status, updatedAt: row.updated_at };
}
function mapInventoryLogRow(row) {
  if (!row) return null;
  return { id: row.id, medicine: { id: row.medicine_id, medicineName: row.medicine_name, barcode: row.barcode, batchNumber: row.batch_number }, admin: row.admin_id ? { id: row.admin_id, fullName: row.admin_name, email: row.admin_email } : null, transactionType: mapTransactionTypeFromDatabase(row.transaction_type), quantityChange: Number(row.quantity_change || 0), previousQuantity: Number(row.previous_quantity ?? 0), newQuantity: Number(row.new_quantity ?? row.remaining_stock ?? 0), reason: row.reason || row.remarks, notes: row.notes, referenceType: row.reference_type, referenceId: row.reference_id, createdAt: row.created_at };
}
module.exports = { mapInventoryMedicineRow, mapInventoryLogRow, mapTransactionTypeFromDatabase, mapTransactionTypeToDatabase };
