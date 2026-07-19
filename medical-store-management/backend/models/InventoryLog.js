const BaseModel = require('./BaseModel');

class InventoryLog extends BaseModel {
  constructor() {
    super({
      tableName: 'inventory_logs',
      primaryKey: 'id',
      allowedFields: ['medicine_id', 'transaction_type', 'quantity', 'remaining_stock', 'remarks'],
      searchableFields: ['remarks'],
      sortableFields: ['id', 'medicine_id', 'created_at'],
      defaultSortColumn: 'created_at',
      defaultSortDirection: 'DESC',
    });
  }

  async findByMedicineId(medicineId, options = {}) {
    const sql = `SELECT * FROM inventory_logs WHERE medicine_id = ? ORDER BY created_at DESC LIMIT ?`;
    const params = [medicineId, options.limit || 20];
    const [rows] = await this.executeQuery(sql, params);
    return rows;
  }
}

module.exports = new InventoryLog();
