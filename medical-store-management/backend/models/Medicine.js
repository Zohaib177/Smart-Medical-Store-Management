const BaseModel = require('./BaseModel');

class Medicine extends BaseModel {
  constructor() {
    super({
      tableName: 'medicines',
      primaryKey: 'id',
      allowedFields: ['medicine_name', 'generic_name', 'category_id', 'company_id', 'barcode', 'batch_number', 'strength', 'dosage_form', 'purchase_price', 'selling_price', 'stock_quantity', 'minimum_stock', 'expiry_date', 'manufacturing_date', 'description', 'image', 'prescription_required', 'status'],
      searchableFields: ['medicine_name', 'generic_name', 'barcode', 'batch_number'],
      sortableFields: ['id', 'medicine_name', 'stock_quantity', 'selling_price', 'created_at', 'updated_at'],
      defaultSortColumn: 'medicine_name',
      defaultSortDirection: 'ASC',
    });
  }

  async findByBarcode(barcode) {
    return this.findOneBy('barcode', barcode);
  }

  async findLowStock() {
    const [rows] = await this.executeQuery('SELECT * FROM medicines WHERE stock_quantity <= minimum_stock ORDER BY stock_quantity ASC');
    return rows;
  }

  async findExpiringSoon(days = 30) {
    const [rows] = await this.executeQuery('SELECT * FROM medicines WHERE expiry_date IS NOT NULL AND expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY) ORDER BY expiry_date ASC', [days]);
    return rows;
  }

  async findExpired() {
    const [rows] = await this.executeQuery('SELECT * FROM medicines WHERE expiry_date IS NOT NULL AND expiry_date < CURDATE() ORDER BY expiry_date ASC');
    return rows;
  }

  async calculateStockStatus(medicine) {
    if (!medicine) {
      return 'inactive';
    }

    if (medicine.stock_quantity <= 0) {
      return 'out_of_stock';
    }

    if (medicine.stock_quantity <= medicine.minimum_stock) {
      return 'low_stock';
    }

    return 'in_stock';
  }
}

module.exports = new Medicine();
