const BaseModel = require('./BaseModel');

class SaleItem extends BaseModel {
  constructor() {
    super({
      tableName: 'sale_items',
      primaryKey: 'id',
      allowedFields: ['sale_id', 'medicine_id', 'quantity', 'unit_price', 'subtotal'],
      searchableFields: ['sale_id', 'medicine_id'],
      sortableFields: ['id', 'sale_id', 'medicine_id', 'created_at'],
      defaultSortColumn: 'created_at',
      defaultSortDirection: 'DESC',
    });
  }
}

module.exports = new SaleItem();
