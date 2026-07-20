const BaseModel = require('./BaseModel');
const { executeQuery, executeSingle } = require('../services/databaseService');
const { normalizePagination, calculateOffset, buildPaginationMetadata } = require('../utils/pagination');
const { mapSupplierRow } = require('../utils/supplierMapper');

class Supplier extends BaseModel {
  constructor() {
    super({
      tableName: 'suppliers', primaryKey: 'id',
      allowedFields: ['supplier_name', 'contact_person', 'email', 'phone', 'address', 'city', 'country', 'status'],
      searchableFields: ['supplier_name', 'contact_person', 'email', 'phone', 'address', 'city', 'country'],
      sortableFields: ['supplier_name', 'contact_person', 'email', 'phone', 'city', 'status', 'created_at', 'updated_at'],
      defaultSortColumn: 'created_at', defaultSortDirection: 'DESC',
    });
  }

  async findAllWithSummary(options = {}) {
    const { page, limit } = normalizePagination(options.page, options.limit);
    const offset = calculateOffset(page, limit);
    const where = []; const values = [];
    const sorts = {
      supplier_name: 's.supplier_name', contact_person: 's.contact_person', email: 's.email',
      phone: 's.phone', city: 's.city', status: 's.status', created_at: 's.created_at',
      updated_at: 's.updated_at', purchase_count: 'purchase_count', total_purchase_amount: 'total_purchase_amount',
    };
    const sort = sorts[options.sortBy] || sorts.created_at;
    const direction = String(options.sortDirection).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    if (options.search) {
      const search = `%${String(options.search).trim()}%`;
      where.push('(s.supplier_name LIKE ? OR s.contact_person LIKE ? OR s.email LIKE ? OR s.phone LIKE ? OR s.address LIKE ? OR s.city LIKE ? OR s.country LIKE ?)');
      values.push(...Array(7).fill(search));
    }
    if (options.status) { where.push('s.status = ?'); values.push(options.status); }
    if (options.city) { where.push('s.city = ?'); values.push(options.city); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const summaryJoin = `LEFT JOIN (SELECT supplier_id, COUNT(*) purchase_count, COALESCE(SUM(total_amount), 0) total_purchase_amount FROM purchases GROUP BY supplier_id) ps ON ps.supplier_id = s.id`;
    const rows = await executeQuery(`SELECT s.*, COALESCE(ps.purchase_count, 0) purchase_count, COALESCE(ps.total_purchase_amount, 0) total_purchase_amount FROM suppliers s ${summaryJoin} ${whereSql} ORDER BY ${sort} ${direction} LIMIT ${limit} OFFSET ${offset}`, values);
    const count = await executeSingle(`SELECT COUNT(*) totalRecords FROM suppliers s ${whereSql}`, values);
    return { data: rows.map(mapSupplierRow), pagination: buildPaginationMetadata(page, limit, Number(count?.totalRecords || 0)) };
  }

  async findByIdWithSummary(id) {
    const row = await executeSingle(`SELECT s.*, COUNT(p.id) purchase_count, COALESCE(SUM(p.total_amount), 0) total_purchase_amount FROM suppliers s LEFT JOIN purchases p ON p.supplier_id=s.id WHERE s.id=? GROUP BY s.id`, [id]);
    return mapSupplierRow(row);
  }

  async findActiveOptions() {
    const [suppliers, cityRows] = await Promise.all([
      executeQuery("SELECT id, supplier_name AS supplierName, phone, city FROM suppliers WHERE status='active' ORDER BY supplier_name ASC"),
      executeQuery("SELECT DISTINCT city FROM suppliers WHERE city IS NOT NULL AND TRIM(city) <> '' ORDER BY city ASC"),
    ]);
    return { suppliers, cities: cityRows.map((row) => row.city) };
  }

  async findByNameInsensitive(name) { return executeSingle('SELECT * FROM suppliers WHERE LOWER(supplier_name)=LOWER(?) LIMIT 1', [name]); }
  async findByIdForUpdate(id, connection) { const [rows] = await connection.execute('SELECT * FROM suppliers WHERE id=? FOR UPDATE',[id]); return rows[0] || null; }
  async existsByNameInsensitive(name, excludeId = null) { const sql = excludeId ? 'SELECT 1 FROM suppliers WHERE LOWER(supplier_name)=LOWER(?) AND id<>? LIMIT 1' : 'SELECT 1 FROM suppliers WHERE LOWER(supplier_name)=LOWER(?) LIMIT 1'; return Boolean(await executeSingle(sql, excludeId ? [name, excludeId] : [name])); }
  async findByEmail(email, excludeId = null) { if (!email) return null; const sql = excludeId ? 'SELECT id FROM suppliers WHERE LOWER(email)=LOWER(?) AND id<>? LIMIT 1' : 'SELECT id FROM suppliers WHERE LOWER(email)=LOWER(?) LIMIT 1'; return executeSingle(sql, excludeId ? [email, excludeId] : [email]); }
  async createSupplier(data, connection = null) { const executor = connection ? async (sql, params) => (await connection.execute(sql, params))[0] : executeQuery; const fields = Object.keys(data); const result = await executor(`INSERT INTO suppliers (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, fields.map((field) => data[field])); return this.findByIdWithSummary(result.insertId); }
  async updateSupplier(id, data, connection = null) { const executor = connection ? async (sql, params) => (await connection.execute(sql, params))[0] : executeQuery; const fields = Object.keys(data); await executor(`UPDATE suppliers SET ${fields.map((field) => `${field}=?`).join(',')} WHERE id=?`, [...fields.map((field) => data[field]), id]); return this.findByIdWithSummary(id); }
  async updateStatus(id, status) { await executeQuery('UPDATE suppliers SET status=? WHERE id=?', [status, id]); return this.findByIdWithSummary(id); }
  async getPurchaseSummary(id) { const row = await executeSingle('SELECT COUNT(*) purchaseCount, COALESCE(SUM(total_amount),0) totalPurchaseAmount FROM purchases WHERE supplier_id=?', [id]); return { purchaseCount: Number(row?.purchaseCount || 0), totalPurchaseAmount: Number(row?.totalPurchaseAmount || 0) }; }
  async getPurchaseCount(id) { return (await this.getPurchaseSummary(id)).purchaseCount; }
  async deleteSupplier(id) { return executeQuery('DELETE FROM suppliers WHERE id=?', [id]); }
}

module.exports = new Supplier();
