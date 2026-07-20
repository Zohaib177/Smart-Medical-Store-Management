export const transactionTypes = [
  { value: 'stockIn', label: 'Stock In' },
  { value: 'stockOut', label: 'Stock Out' },
  { value: 'correction', label: 'Correct Stock' },
];

export function calculateNewStock(current, quantity, type) {
  const stock = Number(current) || 0; const amount = Number(quantity);
  if (!Number.isFinite(amount)) return stock;
  if (type === 'stockIn') return stock + amount;
  if (type === 'stockOut') return stock - amount;
  return amount;
}
export function calculateQuantityChange(current, quantity, type) { return calculateNewStock(current, quantity, type) - (Number(current) || 0); }
export function getTransactionTypeLabel(type) { return transactionTypes.find((item) => item.value === type)?.label || ({purchase:'Purchase',purchaseCancellation:'Purchase Cancellation',sale:'Sale',saleCancellation:'Sale Cancellation'}[type] || type); }
export function getTransactionTypeDescription(type) { return ({ stockIn: 'Adds units to current stock.', stockOut: 'Removes units from current stock.', correction: 'Sets stock to an exact counted quantity.' }[type] || ''); }
export function formatStockChange(value) { const number = Number(value) || 0; return number > 0 ? `+${number}` : String(number); }
export function validateStockAdjustment(values, currentStock) {
  const errors = {}; const quantity = Number(values.quantity);
  if (!Number.isInteger(quantity) || quantity < (values.transactionType === 'correction' ? 0 : 1)) errors.quantity = values.transactionType === 'correction' ? 'Enter a whole number of zero or greater.' : 'Enter a positive whole number.';
  if (!values.reason.trim() || values.reason.trim().length < 3) errors.reason = 'Reason must be at least 3 characters.';
  if (values.reason.trim().length > 255) errors.reason = 'Reason must not exceed 255 characters.';
  if (values.notes.trim().length > 1000) errors.notes = 'Notes must not exceed 1000 characters.';
  if (values.transactionType === 'stockOut' && quantity > currentStock) errors.quantity = 'Insufficient stock for this adjustment.';
  return errors;
}
export function buildAdjustmentPayload(values) { return { transactionType: values.transactionType, quantity: Number(values.quantity), reason: values.reason.trim(), notes: values.notes.trim() || null }; }
export function getInventoryErrorMessage(error, fallback = 'Unable to complete inventory request.') {
  const code = error?.response?.data?.errorCode || error?.response?.data?.error?.code || error?.response?.data?.code;
  if (code === 'INSUFFICIENT_STOCK') return 'Insufficient stock for this adjustment.';
  if (code === 'NEGATIVE_STOCK_NOT_ALLOWED') return 'Stock cannot become negative.';
  return error?.response?.data?.message || fallback;
}
