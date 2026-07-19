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
}

module.exports = new Customer();
