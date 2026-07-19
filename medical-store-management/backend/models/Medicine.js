const BaseModel = require('./BaseModel');
const { executeQuery, executeSingle } = require('../services/databaseService');
const { normalizePagination, calculateOffset, buildPaginationMetadata } = require('../utils/pagination');
const { mapMedicineRow } = require('../utils/medicineMapper');

const selectFields = `m.*, mc.category_name, co.company_name,
  DATE_FORMAT(m.manufacturing_date, '%Y-%m-%d') AS manufacturing_date,
  DATE_FORMAT(m.expiry_date, '%Y-%m-%d') AS expiry_date,
  CASE WHEN m.expiry_date IS NULL THEN NULL ELSE DATEDIFF(m.expiry_date, CURRENT_DATE) END AS days_until_expiry`;

class Medicine extends BaseModel {
  constructor() {
    super({
      tableName: 'medicines', primaryKey: 'id',
      allowedFields: ['medicine_name', 'generic_name', 'category_id', 'company_id', 'barcode', 'batch_number', 'strength', 'dosage_form', 'purchase_price', 'selling_price', 'stock_quantity', 'minimum_stock', 'expiry_date', 'manufacturing_date', 'description', 'image', 'prescription_required', 'status'],
      searchableFields: ['medicine_name', 'generic_name', 'barcode', 'batch_number'],
      sortableFields: ['medicine_name', 'generic_name', 'purchase_price', 'sale_price', 'stock_quantity', 'minimum_stock', 'expiry_date', 'status', 'created_at', 'updated_at'],
      defaultSortColumn: 'created_at', defaultSortDirection: 'DESC',
    });
  }

  async findAllWithRelations(options = {}) {
    const { page, limit } = normalizePagination(options.page, options.limit);
    const offset = calculateOffset(page, limit);
    const where = [];
    const values = [];
    const sortColumns = {
      medicine_name: 'm.medicine_name', generic_name: 'm.generic_name', purchase_price: 'm.purchase_price',
      sale_price: 'm.selling_price', stock_quantity: 'm.stock_quantity', minimum_stock: 'm.minimum_stock',
      expiry_date: 'm.expiry_date', status: 'm.status', created_at: 'm.created_at', updated_at: 'm.updated_at',
    };
    const sortBy = sortColumns[options.sortBy] || sortColumns.created_at;
    const direction = String(options.sortDirection).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    if (options.search) {
      const search = `%${String(options.search).trim()}%`;
      where.push('(m.medicine_name LIKE ? OR m.generic_name LIKE ? OR m.barcode LIKE ? OR m.batch_number LIKE ? OR m.description LIKE ? OR mc.category_name LIKE ? OR co.company_name LIKE ?)');
      values.push(...Array(7).fill(search));
    }
    if (options.status) { where.push('m.status = ?'); values.push(options.status); }
    if (options.categoryId) { where.push('m.category_id = ?'); values.push(options.categoryId); }
    if (options.companyId) { where.push('m.company_id = ?'); values.push(options.companyId); }
    if (options.stockStatus === 'outOfStock') where.push('m.stock_quantity <= 0');
    if (options.stockStatus === 'lowStock') where.push('m.stock_quantity > 0 AND m.stock_quantity <= m.minimum_stock');
    if (options.stockStatus === 'inStock') where.push('m.stock_quantity > m.minimum_stock');
    if (options.expiryStatus === 'unknown') where.push('m.expiry_date IS NULL');
    if (options.expiryStatus === 'expired') where.push('m.expiry_date < CURRENT_DATE');
    if (options.expiryStatus === 'expiringSoon') where.push('m.expiry_date >= CURRENT_DATE AND m.expiry_date <= DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)');
    if (options.expiryStatus === 'valid') where.push('m.expiry_date > DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)');
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const joins = 'JOIN medicine_categories mc ON mc.id = m.category_id JOIN medicine_companies co ON co.id = m.company_id';
    const rows = await executeQuery(`SELECT ${selectFields} FROM medicines m ${joins} ${whereSql} ORDER BY ${sortBy} ${direction} LIMIT ${limit} OFFSET ${offset}`, values);
    const count = await executeSingle(`SELECT COUNT(*) AS totalRecords FROM medicines m ${joins} ${whereSql}`, values);
    return { data: rows.map(mapMedicineRow), pagination: buildPaginationMetadata(page, limit, Number(count?.totalRecords || 0)) };
  }

  async findByIdWithRelations(id) {
    const row = await executeSingle(`SELECT ${selectFields} FROM medicines m JOIN medicine_categories mc ON mc.id=m.category_id JOIN medicine_companies co ON co.id=m.company_id WHERE m.id=?`, [id]);
    return mapMedicineRow(row);
  }

  async findByBarcode(barcode) { return executeSingle('SELECT * FROM medicines WHERE barcode = ? LIMIT 1', [barcode]); }
  async existsByBarcode(barcode, excludeId = null) {
    if (!barcode) return false;
    const sql = excludeId ? 'SELECT 1 FROM medicines WHERE barcode = ? AND id <> ? LIMIT 1' : 'SELECT 1 FROM medicines WHERE barcode = ? LIMIT 1';
    return Boolean(await executeSingle(sql, excludeId ? [barcode, excludeId] : [barcode]));
  }
  async createMedicine(data) {
    const fields = Object.keys(data); const placeholders = fields.map(() => '?').join(', ');
    const result = await executeQuery(`INSERT INTO medicines (${fields.join(', ')}) VALUES (${placeholders})`, fields.map((field) => data[field]));
    return this.findByIdWithRelations(result.insertId);
  }
  async updateMedicine(id, data) {
    const fields = Object.keys(data); const assignments = fields.map((field) => `${field} = ?`).join(', ');
    await executeQuery(`UPDATE medicines SET ${assignments} WHERE id = ?`, [...fields.map((field) => data[field]), id]);
    return this.findByIdWithRelations(id);
  }
  async updateStatus(id, status) { await executeQuery('UPDATE medicines SET status=? WHERE id=?', [status, id]); return this.findByIdWithRelations(id); }
  async getUsageCounts(id) {
    return executeSingle(`SELECT (SELECT COUNT(*) FROM purchase_items WHERE medicine_id=?) AS purchases,
      (SELECT COUNT(*) FROM sale_items WHERE medicine_id=?) AS sales,
      (SELECT COUNT(*) FROM inventory_logs WHERE medicine_id=?) AS inventoryLogs`, [id, id, id]);
  }
  async deleteMedicine(id) { return executeQuery('DELETE FROM medicines WHERE id=?', [id]); }
  async getActiveOptions() {
    const [categories, companies] = await Promise.all([
      executeQuery("SELECT id, category_name AS categoryName FROM medicine_categories WHERE status='active' ORDER BY category_name ASC"),
      executeQuery("SELECT id, company_name AS companyName FROM medicine_companies WHERE status='active' ORDER BY company_name ASC"),
    ]);
    return { categories, companies };
  }
  async findLowStock() { return executeQuery('SELECT * FROM medicines WHERE stock_quantity > 0 AND stock_quantity <= minimum_stock ORDER BY stock_quantity ASC'); }
  async findExpiringSoon(days = 30) { const safeDays = Math.floor(Math.max(1, Number(days) || 30)); return executeQuery(`SELECT * FROM medicines WHERE expiry_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL ${safeDays} DAY) ORDER BY expiry_date`); }
  async findExpired() { return executeQuery('SELECT * FROM medicines WHERE expiry_date < CURRENT_DATE ORDER BY expiry_date'); }
  calculateStockStatus(medicine) { if (medicine.stockQuantity <= 0) return 'outOfStock'; return medicine.stockQuantity <= medicine.minimumStock ? 'lowStock' : 'inStock'; }
  calculateExpiryStatus(medicine) { if (medicine.daysUntilExpiry == null) return 'unknown'; if (medicine.daysUntilExpiry < 0) return 'expired'; return medicine.daysUntilExpiry <= 30 ? 'expiringSoon' : 'valid'; }
}

module.exports = new Medicine();
