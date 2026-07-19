const BaseModel = require('./BaseModel');

class MedicineCompany extends BaseModel {
  constructor() {
    super({
      tableName: 'medicine_companies',
      primaryKey: 'id',
      allowedFields: ['company_name', 'contact_person', 'email', 'phone', 'address', 'status'],
      searchableFields: ['company_name', 'contact_person', 'email', 'phone'],
      sortableFields: ['id', 'company_name', 'created_at', 'updated_at'],
      defaultSortColumn: 'company_name',
      defaultSortDirection: 'ASC',
    });
  }

  async findActive() {
    return this.findAll({ status: 'active' });
  }

  async findByName(companyName) {
    return this.findOneBy('company_name', companyName);
  }
}

module.exports = new MedicineCompany();
