const BaseModel = require('./BaseModel');

class Customer extends BaseModel {
  constructor() {
    super({
      tableName: 'customers',
      primaryKey: 'id',
      allowedFields: ['customer_name', 'phone', 'email', 'address'],
      searchableFields: ['customer_name', 'phone', 'email', 'address'],
      sortableFields: ['id', 'customer_name', 'created_at', 'updated_at'],
      defaultSortColumn: 'customer_name',
      defaultSortDirection: 'ASC',
    });
  }

  async findByPhone(phone) {
    return this.findOneBy('phone', phone);
  }

  async getSaleOptions() {
    const { executeQuery } = require('../services/databaseService');
    return executeQuery('SELECT id,customer_name AS customerName,phone,email FROM customers ORDER BY customer_name ASC LIMIT 500');
  }

  async findByIdForUpdate(id, connection) {
    const [rows] = await connection.execute('SELECT id,customer_name,phone,email FROM customers WHERE id=? FOR UPDATE', [id]);
    return rows[0] || null;
  }
}

module.exports = new Customer();
