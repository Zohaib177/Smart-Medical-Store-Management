const BaseModel = require('./BaseModel');

class Supplier extends BaseModel {
  constructor() {
    super({
      tableName: 'suppliers',
      primaryKey: 'id',
      allowedFields: ['supplier_name', 'contact_person', 'email', 'phone', 'address', 'city', 'country', 'status'],
      searchableFields: ['supplier_name', 'contact_person', 'email', 'phone', 'city', 'country'],
      sortableFields: ['id', 'supplier_name', 'created_at', 'updated_at'],
      defaultSortColumn: 'supplier_name',
      defaultSortDirection: 'ASC',
    });
  }

  async findActive() {
    return this.findAll({ status: 'active' });
  }

  async findByPhone(phone) {
    return this.findOneBy('phone', phone);
  }
}

module.exports = new Supplier();
