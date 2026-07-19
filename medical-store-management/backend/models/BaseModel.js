const { pool } = require('../config/database');
const { sanitizeSortDirection, validateAllowedSortColumn } = require('../utils/sqlHelpers');
const { calculateOffset, buildPaginationMetadata } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');

class BaseModel {
  constructor({ tableName, primaryKey = 'id', allowedFields = [], searchableFields = [], sortableFields = [], defaultSortColumn = null, defaultSortDirection = 'ASC' }) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.allowedFields = allowedFields;
    this.searchableFields = searchableFields;
    this.sortableFields = sortableFields;
    this.defaultSortColumn = defaultSortColumn;
    this.defaultSortDirection = defaultSortDirection;
  }

  validateFields(data) {
    if (!data || typeof data !== 'object') {
      return [];
    }

    const invalidFields = Object.keys(data).filter((field) => !this.allowedFields.includes(field));
    return invalidFields;
  }

  sanitizeSort(sortBy, sortDirection) {
    const normalizedSortBy = validateAllowedSortColumn(sortBy, this.sortableFields) || this.defaultSortColumn;
    const normalizedSortDirection = sanitizeSortDirection(sortDirection || this.defaultSortDirection);
    return { sortBy: normalizedSortBy, sortDirection: normalizedSortDirection };
  }

  buildSearchClause(search) {
    if (!search || !this.searchableFields.length) {
      return { clause: '', values: [] };
    }

    const searchTerm = `%${String(search).trim()}%`;
    const conditions = this.searchableFields.map((field) => `${field} LIKE ?`).join(' OR ');
    return { clause: `AND (${conditions})`, values: Array(this.searchableFields.length).fill(searchTerm) };
  }

  async findAll(options = {}) {
    const { page, limit, search, status, sortBy, sortDirection } = options;
    const { sortBy: normalizedSortBy, sortDirection: normalizedSortDirection } = this.sanitizeSort(sortBy, sortDirection);
    const { page: currentPage, limit: currentLimit } = { page: 1, limit: 10, ...options };
    const offset = calculateOffset(currentPage, currentLimit);
    const searchClause = this.buildSearchClause(search);
    const whereClauses = [];

    if (status) {
      whereClauses.push('status = ?');
      searchClause.values.push(status);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const sql = `SELECT * FROM ${this.tableName} ${whereSql} ${searchClause.clause} ORDER BY ${normalizedSortBy || this.defaultSortColumn} ${normalizedSortDirection} LIMIT ?, ?`;
    const params = [...searchClause.values, offset, currentLimit];

    const [rows] = await pool.execute(sql, params);
    const [countRows] = await pool.execute(`SELECT COUNT(*) AS totalRecords FROM ${this.tableName} ${whereSql} ${searchClause.clause}`.replace(/\s+/g, ' ').trim(), searchClause.values);
    const totalRecords = countRows[0]?.totalRecords || 0;

    return {
      data: rows,
      pagination: buildPaginationMetadata(currentPage, currentLimit, Number(totalRecords)),
    };
  }

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ? LIMIT 1`, [id]);
    return rows[0] || null;
  }

  async findOneBy(field, value) {
    const [rows] = await pool.execute(`SELECT * FROM ${this.tableName} WHERE ${field} = ? LIMIT 1`, [value]);
    return rows[0] || null;
  }

  async exists(field, value) {
    const [rows] = await pool.execute(`SELECT 1 FROM ${this.tableName} WHERE ${field} = ? LIMIT 1`, [value]);
    return rows.length > 0;
  }

  async count(filters = {}) {
    const conditions = [];
    const values = [];

    Object.keys(filters).forEach((field) => {
      if (this.allowedFields.includes(field)) {
        conditions.push(`${field} = ?`);
        values.push(filters[field]);
      }
    });

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await pool.execute(`SELECT COUNT(*) AS totalRecords FROM ${this.tableName} ${whereSql}`.trim(), values);
    return Number(rows[0]?.totalRecords || 0);
  }

  async create(data) {
    const invalidFields = this.validateFields(data);
    if (invalidFields.length > 0) {
      throw new ApiError(400, 'Invalid fields provided', 'INVALID_FIELDS', { invalidFields });
    }

    const columns = Object.keys(data || {});
    if (!columns.length) {
      throw new ApiError(400, 'No data provided', 'NO_DATA_PROVIDED');
    }

    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map((field) => data[field]);
    const [result] = await pool.execute(`INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`, values);
    return { insertId: result.insertId };
  }

  async updateById(id, data) {
    const invalidFields = this.validateFields(data);
    if (invalidFields.length > 0) {
      throw new ApiError(400, 'Invalid fields provided', 'INVALID_FIELDS', { invalidFields });
    }

    if (!data || Object.keys(data).length === 0) {
      throw new ApiError(400, 'No data provided', 'NO_DATA_PROVIDED');
    }

    const columns = Object.keys(data);
    const assignments = columns.map((field) => `${field} = ?`).join(', ');
    const values = columns.map((field) => data[field]);
    await pool.execute(`UPDATE ${this.tableName} SET ${assignments} WHERE ${this.primaryKey} = ?`, [...values, id]);
    return this.findById(id);
  }

  async deleteById(id) {
    await pool.execute(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`, [id]);
    return true;
  }

  async softStatusUpdate(id, status) {
    await pool.execute(`UPDATE ${this.tableName} SET status = ? WHERE ${this.primaryKey} = ?`, [status, id]);
    return this.findById(id);
  }
}

module.exports = BaseModel;
