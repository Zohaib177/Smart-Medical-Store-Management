const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Medicine = require('../models/Medicine');
const Customer = require('../models/Customer');
const InventoryLog = require('../models/InventoryLog');
const { withTransaction } = require('./databaseService');
const { mapSaleInput, money } = require('../utils/saleMapper');
const { generateSaleNumber } = require('../utils/saleNumber');
const codes = [
  'SALE_NOT_FOUND',
  'SALE_ALREADY_CANCELLED',
  'INVALID_DATE_RANGE',
  'INVALID_SALE_DATE',
  'INVALID_SALE_ITEMS',
  'INVALID_SALE_QUANTITY',
  'DUPLICATE_SALE_MEDICINE',
  'MEDICINE_NOT_FOUND',
  'MEDICINE_INACTIVE',
  'MEDICINE_EXPIRED',
  'INSUFFICIENT_STOCK',
  'INVALID_DISCOUNT',
  'INVALID_PAID_AMOUNT',
  'INVALID_PAYMENT_METHOD',
  'INSUFFICIENT_RECEIVED_AMOUNT',
  'CREDIT_SALES_NOT_SUPPORTED',
  'CUSTOMER_NOT_FOUND',
];
function dateRange(q) {
  if (q.dateFrom && q.dateTo && q.dateFrom > q.dateTo)
    throw new ApiError(422, 'Date from cannot be after date to', 'INVALID_DATE_RANGE');
}
async function getSales(q) {
  dateRange(q);
  try {
    return await Sale.findAllWithSummary(q);
  } catch (e) {
    if (e.errorCode) throw e;
    throw new ApiError(500, 'Unable to retrieve sales', 'INTERNAL_SERVER_ERROR');
  }
}
async function getSummary() {
  try {
    return { ...(await Sale.getSummary()), generatedAt: new Date().toISOString() };
  } catch (e) {
    throw new ApiError(500, 'Unable to retrieve sales summary', 'INTERNAL_SERVER_ERROR');
  }
}
async function getOptions() {
  try {
    return {
      customers: await Customer.getSaleOptions(),
      categories: await Medicine.getSaleCategories(),
      paymentMethods: ['cash', 'card', 'online'],
      creditSalesSupported: false,
    };
  } catch (e) {
    throw new ApiError(500, 'Unable to retrieve sale options', 'INTERNAL_SERVER_ERROR');
  }
}
async function getPosMedicines(q) {
  try {
    return await Medicine.getPosMedicines(q);
  } catch (e) {
    throw new ApiError(500, 'Unable to retrieve POS medicines', 'INTERNAL_SERVER_ERROR');
  }
}
async function getById(id) {
  try {
    const sale = await Sale.findByIdWithRelations(id);
    if (!sale) throw new ApiError(404, 'Sale not found', 'SALE_NOT_FOUND');
    sale.items = await SaleItem.findBySaleId(id);
    return sale;
  } catch (e) {
    if (e.errorCode) throw e;
    throw new ApiError(500, 'Unable to retrieve sale', 'INTERNAL_SERVER_ERROR');
  }
}
function normalizeItems(items) {
  const merged = new Map();
  for (const i of items) {
    if (!Number.isInteger(i.quantity) || i.quantity < 1)
      throw new ApiError(422, 'Sale quantity must be a positive integer', 'INVALID_SALE_QUANTITY');
    merged.set(i.medicineId, (merged.get(i.medicineId) || 0) + i.quantity);
  }
  return [...merged].map(([medicineId, quantity]) => ({ medicineId, quantity }));
}
async function createSale(adminId, input) {
  const data = mapSaleInput(input);
  data.saleDate = data.saleDate || new Date().toISOString().slice(0, 10);
  if (data.saleDate > new Date().toISOString().slice(0, 10))
    throw new ApiError(422, 'Future sale dates are not allowed', 'INVALID_SALE_DATE');
  if (!data.items.length) throw new ApiError(422, 'At least one sale item is required', 'INVALID_SALE_ITEMS');
  data.items = normalizeItems(data.items);
  if (!['cash', 'card', 'online'].includes(data.paymentMethod))
    throw new ApiError(422, 'Payment method is not supported', 'INVALID_PAYMENT_METHOD');
  try {
    const id = await withTransaction(async (c) => {
      if (data.customerId && !(await Customer.findByIdForUpdate(data.customerId, c)))
        throw new ApiError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
      const ids = data.items.map((x) => x.medicineId).sort((a, b) => a - b),
        marks = ids.map(() => '?').join(',');
      const [rows] = await c.execute(
        `SELECT id,medicine_name,selling_price,stock_quantity,expiry_date,status FROM medicines WHERE id IN (${marks}) ORDER BY id FOR UPDATE`,
        ids
      );
      if (rows.length !== ids.length) throw new ApiError(404, 'Medicine not found', 'MEDICINE_NOT_FOUND');
      const byId = new Map(rows.map((r) => [r.id, r])),
        today = new Date().toISOString().slice(0, 10),
        items = [];
      for (const item of data.items) {
        const m = byId.get(item.medicineId);
        const expiry = m.expiry_date ? new Date(m.expiry_date).toISOString().slice(0, 10) : null;
        if (m.status !== 'active') throw new ApiError(409, `${m.medicine_name} is inactive`, 'MEDICINE_INACTIVE');
        if (expiry && expiry < today)
          throw new ApiError(409, `${m.medicine_name} has expired and cannot be sold`, 'MEDICINE_EXPIRED');
        if (Number(m.stock_quantity) < item.quantity)
          throw new ApiError(409, `Insufficient stock available for ${m.medicine_name}`, 'INSUFFICIENT_STOCK');
        const price = money(m.selling_price);
        items.push({ ...item, unitSalePrice: price, subtotal: money(price * item.quantity) });
      }
      const subtotal = money(items.reduce((s, i) => s + i.subtotal, 0)),
        total = money(subtotal - data.discountAmount + data.taxAmount);
      if (data.discountAmount > subtotal || total < 0)
        throw new ApiError(422, 'Discount cannot exceed subtotal', 'INVALID_DISCOUNT');
      if (data.paidAmount > total) throw new ApiError(422, 'Paid amount cannot exceed total', 'INVALID_PAID_AMOUNT');
      if (data.paidAmount < total)
        throw new ApiError(
          422,
          'Credit, partial and unpaid sales are not supported by the current customer schema',
          'CREDIT_SALES_NOT_SUPPORTED'
        );
      const paid = total,
        due = 0,
        received = data.paymentMethod === 'cash' ? data.receivedAmount : paid;
      if (data.paymentMethod === 'cash' && received < paid)
        throw new ApiError(422, 'Received amount is insufficient', 'INSUFFICIENT_RECEIVED_AMOUNT');
      const change = data.paymentMethod === 'cash' ? money(received - paid) : 0;
      const temporary = `TMP-${crypto.randomUUID()}`;
      const saleId = await Sale.createSale(
          {
            customer_id: data.customerId,
            invoice_number: temporary,
            sale_date: data.saleDate,
            total_amount: subtotal,
            discount: data.discountAmount,
            tax: data.taxAmount,
            grand_total: total,
            paid_amount: paid,
            due_amount: due,
            received_amount: received,
            change_amount: change,
            payment_method: data.paymentMethod,
            payment_status: 'paid',
            sale_status: 'completed',
            notes: data.notes,
            created_by: adminId,
          },
          c
        ),
        number = generateSaleNumber(saleId, data.saleDate);
      await Sale.finalizeNumber(saleId, number, c);
      await SaleItem.createMany(saleId, items, c);
      for (const item of items) {
        const m = byId.get(item.medicineId),
          previous = Number(m.stock_quantity),
          next = previous - item.quantity;
        await Medicine.updateStockQuantity(item.medicineId, next, c);
        await InventoryLog.createLog(
          {
            medicineId: item.medicineId,
            adminId,
            transactionType: 'sale',
            quantity: item.quantity,
            quantityChange: -item.quantity,
            previousQuantity: previous,
            newQuantity: next,
            referenceType: 'sale',
            referenceId: saleId,
            reason: `Stock sold through sale ${number}`,
          },
          c
        );
      }
      return saleId;
    });
    return await getById(id);
  } catch (e) {
    if (codes.includes(e.errorCode)) throw e;
    throw new ApiError(500, 'Unable to complete sale', 'SALE_CREATE_FAILED');
  }
}
async function cancelSale(id, adminId, reason) {
  try {
    await withTransaction(async (c) => {
      const sale = await Sale.findByIdForUpdate(id, c);
      if (!sale) throw new ApiError(404, 'Sale not found', 'SALE_NOT_FOUND');
      if (sale.sale_status === 'cancelled')
        throw new ApiError(409, 'This sale has already been cancelled', 'SALE_ALREADY_CANCELLED');
      const items = await SaleItem.findBySaleId(id, c);
      if (!items.length) throw new ApiError(409, 'Sale items could not be found', 'INVALID_SALE_ITEMS');
      const ids = items.map((x) => x.medicine.id).sort((a, b) => a - b),
        marks = ids.map(() => '?').join(',');
      const [rows] = await c.execute(
        `SELECT id,medicine_name,stock_quantity FROM medicines WHERE id IN (${marks}) ORDER BY id FOR UPDATE`,
        ids
      );
      if (rows.length !== ids.length) throw new ApiError(404, 'Medicine not found', 'MEDICINE_NOT_FOUND');
      const byId = new Map(rows.map((r) => [r.id, r]));
      for (const item of items) {
        const m = byId.get(item.medicine.id),
          previous = Number(m.stock_quantity),
          next = previous + item.quantity;
        await Medicine.updateStockQuantity(item.medicine.id, next, c);
        await InventoryLog.createLog(
          {
            medicineId: item.medicine.id,
            adminId,
            transactionType: 'saleCancellation',
            quantity: item.quantity,
            quantityChange: item.quantity,
            previousQuantity: previous,
            newQuantity: next,
            referenceType: 'sale_cancellation',
            referenceId: Number(id),
            reason: `Stock restored for cancelled sale ${sale.sale_number}`,
            notes: reason,
          },
          c
        );
      }
      await Sale.cancel(id, adminId, reason, c);
    });
    return await getById(id);
  } catch (e) {
    if (codes.includes(e.errorCode)) throw e;
    throw new ApiError(500, 'Unable to cancel sale', 'SALE_CANCEL_FAILED');
  }
}
module.exports = { getSales, getSummary, getOptions, getPosMedicines, getById, createSale, cancelSale };
