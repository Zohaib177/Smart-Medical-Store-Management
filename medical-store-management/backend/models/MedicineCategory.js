const BaseModel = require('./BaseModel');

class MedicineCategory extends BaseModel {
  constructor() {
    super({
      tableName: 'medicine_categories',
      primaryKey: 'id',
      allowedFields: ['category_name', 'description', 'status'],
      searchableFields: ['category_name', 'description'],
      sortableFields: ['id', 'category_name', 'created_at', 'updated_at'],
      defaultSortColumn: 'category_name',
      defaultSortDirection: 'ASC',
    });
  }

  async findActive() {
    return this.findAll({ status: 'active' });
  }

  async findByName(categoryName) {
    return this.findOneBy('category_name', categoryName);
  }
}

module.exports = new MedicineCategory();
