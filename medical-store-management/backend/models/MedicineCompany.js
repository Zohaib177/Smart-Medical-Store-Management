const BaseModel = require('./BaseModel');
const { executeQuery, executeSingle } = require('../services/databaseService');
const { normalizePagination, calculateOffset, buildPaginationMetadata } = require('../utils/pagination');

class MedicineCompany extends BaseModel {
  constructor() {
    super({
      tableName: 'medicine_companies',
      primaryKey: 'id',
      allowedFields: ['company_name', 'contact_person', 'email', 'phone', 'address', 'status'],
      searchableFields: ['company_name', 'contact_person', 'email', 'phone', 'address'],
      sortableFields: ['company_name', 'contact_person', 'email', 'phone', 'status', 'created_at', 'updated_at'],
      defaultSortColumn: 'created_at',
      defaultSortDirection: 'DESC',
    });
  }

  async findActive() {
    return this.findAll({ status: 'active' });
  }

  async findByName(companyName) {
    return this.findOneBy('company_name', companyName);
  }

  async findAllWithMedicineCount(options = {}) {
    const { page, limit } = normalizePagination(options.page, options.limit);
    const offset = calculateOffset(page, limit);
    const where = [];
    const values = [];
    const sortColumns = {
      company_name: 'mc.company_name', contact_person: 'mc.contact_person', email: 'mc.email',
      phone: 'mc.phone', status: 'mc.status', created_at: 'mc.created_at', updated_at: 'mc.updated_at',
    };
    const sortBy = sortColumns[options.sortBy] || sortColumns.created_at;
    const sortDirection = String(options.sortDirection).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    if (options.search) {
      const search = `%${String(options.search).trim()}%`;
      where.push('(mc.company_name LIKE ? OR mc.contact_person LIKE ? OR mc.email LIKE ? OR mc.phone LIKE ? OR mc.address LIKE ?)');
      values.push(search, search, search, search, search);
    }
    if (options.status) {
      where.push('mc.status = ?');
      values.push(options.status);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const rows = await executeQuery(
      `SELECT mc.id, mc.company_name AS companyName, mc.contact_person AS contactPerson,
        mc.email, mc.phone, mc.address, mc.status, COUNT(m.id) AS medicineCount,
        mc.created_at AS createdAt, mc.updated_at AS updatedAt
      FROM medicine_companies mc
      LEFT JOIN medicines m ON m.company_id = mc.id
      ${whereSql}
      GROUP BY mc.id
      ORDER BY ${sortBy} ${sortDirection}
      LIMIT ${limit} OFFSET ${offset}`,
      values
    );
    const countRow = await executeSingle(`SELECT COUNT(*) AS totalRecords FROM medicine_companies mc ${whereSql}`, values);
    return {
      data: rows.map((row) => ({ ...row, medicineCount: Number(row.medicineCount || 0) })),
      pagination: buildPaginationMetadata(page, limit, Number(countRow?.totalRecords || 0)),
    };
  }

  async findByIdWithMedicineCount(id) {
    const row = await executeSingle(
      `SELECT mc.id, mc.company_name AS companyName, mc.contact_person AS contactPerson,
        mc.email, mc.phone, mc.address, mc.status, COUNT(m.id) AS medicineCount,
        mc.created_at AS createdAt, mc.updated_at AS updatedAt
      FROM medicine_companies mc
      LEFT JOIN medicines m ON m.company_id = mc.id
      WHERE mc.id = ? GROUP BY mc.id`,
      [id]
    );
    return row ? { ...row, medicineCount: Number(row.medicineCount || 0) } : null;
  }

  async findByNameInsensitive(companyName) {
    return executeSingle('SELECT * FROM medicine_companies WHERE LOWER(company_name) = LOWER(?) LIMIT 1', [companyName]);
  }

  async existsByNameInsensitive(companyName, excludeId = null) {
    const sql = excludeId
      ? 'SELECT 1 FROM medicine_companies WHERE LOWER(company_name) = LOWER(?) AND id <> ? LIMIT 1'
      : 'SELECT 1 FROM medicine_companies WHERE LOWER(company_name) = LOWER(?) LIMIT 1';
    return Boolean(await executeSingle(sql, excludeId ? [companyName, excludeId] : [companyName]));
  }

  async createCompany(data) {
    const result = await executeQuery(
      'INSERT INTO medicine_companies (company_name, contact_person, email, phone, address, status) VALUES (?, ?, ?, ?, ?, ?)',
      [data.company_name, data.contact_person, data.email, data.phone, data.address, data.status]
    );
    return this.findByIdWithMedicineCount(result.insertId);
  }

  async updateCompany(id, data) {
    await executeQuery(
      'UPDATE medicine_companies SET company_name = ?, contact_person = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?',
      [data.company_name, data.contact_person, data.email, data.phone, data.address, data.status, id]
    );
    return this.findByIdWithMedicineCount(id);
  }

  async updateStatus(id, status) {
    await executeQuery('UPDATE medicine_companies SET status = ? WHERE id = ?', [status, id]);
    return this.findByIdWithMedicineCount(id);
  }

  async getMedicineCount(id) {
    const row = await executeSingle('SELECT COUNT(*) AS medicineCount FROM medicines WHERE company_id = ?', [id]);
    return Number(row?.medicineCount || 0);
  }

  async deleteCompany(id) {
    return executeQuery('DELETE FROM medicine_companies WHERE id = ?', [id]);
  }

  async findByEmail(email) {
    return executeSingle('SELECT * FROM medicine_companies WHERE LOWER(email) = LOWER(?) LIMIT 1', [email]);
  }
}

module.exports = new MedicineCompany();
