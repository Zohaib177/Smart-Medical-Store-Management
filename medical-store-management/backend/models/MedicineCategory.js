const BaseModel = require('./BaseModel');
const { executeQuery, executeSingle } = require('../services/databaseService');
const { normalizePagination, calculateOffset, buildPaginationMetadata } = require('../utils/pagination');

class MedicineCategory extends BaseModel {
  constructor() {
    super({
      tableName: 'medicine_categories',
      primaryKey: 'id',
      allowedFields: ['category_name', 'description', 'status'],
      searchableFields: ['category_name', 'description'],
      sortableFields: ['category_name', 'status', 'created_at', 'updated_at'],
      defaultSortColumn: 'created_at',
      defaultSortDirection: 'DESC',
    });
  }

  async findActive() {
    return this.findAll({ status: 'active' });
  }

  async findByName(categoryName) {
    return this.findOneBy('category_name', categoryName);
  }

  async findAllWithMedicineCount(options = {}) {
    const { page, limit } = normalizePagination(options.page, options.limit);
    const offset = calculateOffset(page, limit);
    const where = [];
    const values = [];
    const sortColumns = {
      category_name: 'mc.category_name',
      status: 'mc.status',
      created_at: 'mc.created_at',
      updated_at: 'mc.updated_at',
    };
    const sortBy = sortColumns[options.sortBy] || sortColumns.created_at;
    const sortDirection = String(options.sortDirection).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    if (options.search) {
      const search = `%${String(options.search).trim()}%`;
      where.push('(mc.category_name LIKE ? OR mc.description LIKE ?)');
      values.push(search, search);
    }
    if (options.status) {
      where.push('mc.status = ?');
      values.push(options.status);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const rows = await executeQuery(
      `SELECT
        mc.id,
        mc.category_name AS categoryName,
        mc.description,
        mc.status,
        COUNT(m.id) AS medicineCount,
        mc.created_at AS createdAt,
        mc.updated_at AS updatedAt
      FROM medicine_categories mc
      LEFT JOIN medicines m ON m.category_id = mc.id
      ${whereSql}
      GROUP BY mc.id
      ORDER BY ${sortBy} ${sortDirection}
      LIMIT ${limit} OFFSET ${offset}`,
      values
    );
    const countRow = await executeSingle(
      `SELECT COUNT(*) AS totalRecords FROM medicine_categories mc ${whereSql}`,
      values
    );

    return {
      data: rows.map((row) => ({ ...row, medicineCount: Number(row.medicineCount || 0) })),
      pagination: buildPaginationMetadata(page, limit, Number(countRow?.totalRecords || 0)),
    };
  }

  async findByIdWithMedicineCount(id) {
    const row = await executeSingle(
      `SELECT
        mc.id,
        mc.category_name AS categoryName,
        mc.description,
        mc.status,
        COUNT(m.id) AS medicineCount,
        mc.created_at AS createdAt,
        mc.updated_at AS updatedAt
      FROM medicine_categories mc
      LEFT JOIN medicines m ON m.category_id = mc.id
      WHERE mc.id = ?
      GROUP BY mc.id`,
      [id]
    );
    return row ? { ...row, medicineCount: Number(row.medicineCount || 0) } : null;
  }

  async findByNameInsensitive(categoryName) {
    return executeSingle('SELECT * FROM medicine_categories WHERE LOWER(category_name) = LOWER(?) LIMIT 1', [categoryName]);
  }

  async existsByNameInsensitive(categoryName, excludeId = null) {
    const sql = excludeId
      ? 'SELECT 1 FROM medicine_categories WHERE LOWER(category_name) = LOWER(?) AND id <> ? LIMIT 1'
      : 'SELECT 1 FROM medicine_categories WHERE LOWER(category_name) = LOWER(?) LIMIT 1';
    return Boolean(await executeSingle(sql, excludeId ? [categoryName, excludeId] : [categoryName]));
  }

  async createCategory(data) {
    const result = await executeQuery(
      'INSERT INTO medicine_categories (category_name, description, status) VALUES (?, ?, ?)',
      [data.category_name, data.description, data.status]
    );
    return this.findByIdWithMedicineCount(result.insertId);
  }

  async updateCategory(id, data) {
    await executeQuery(
      'UPDATE medicine_categories SET category_name = ?, description = ?, status = ? WHERE id = ?',
      [data.category_name, data.description, data.status, id]
    );
    return this.findByIdWithMedicineCount(id);
  }

  async updateStatus(id, status) {
    await executeQuery('UPDATE medicine_categories SET status = ? WHERE id = ?', [status, id]);
    return this.findByIdWithMedicineCount(id);
  }

  async getMedicineCount(id) {
    const row = await executeSingle('SELECT COUNT(*) AS medicineCount FROM medicines WHERE category_id = ?', [id]);
    return Number(row?.medicineCount || 0);
  }

  async deleteCategory(id) {
    return executeQuery('DELETE FROM medicine_categories WHERE id = ?', [id]);
  }
}

module.exports = new MedicineCategory();
