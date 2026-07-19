const BaseModel = require('./BaseModel');

class PurchaseItem extends BaseModel {
  constructor() {
    super({
      tableName: 'purchase_items',
      primaryKey: 'id',
      allowedFields: ['purchase_id', 'medicine_id', 'quantity', 'purchase_price', 'subtotal'],
      searchableFields: ['purchase_id', 'medicine_id'],
      sortableFields: ['id', 'purchase_id', 'medicine_id', 'created_at'],
      defaultSortColumn: 'created_at',
      defaultSortDirection: 'DESC',
    });
  }
}

module.exports = new PurchaseItem();
