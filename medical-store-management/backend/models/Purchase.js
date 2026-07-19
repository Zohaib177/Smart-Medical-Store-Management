const BaseModel = require('./BaseModel');

class Purchase extends BaseModel {
  constructor() {
    super({
      tableName: 'purchases',
      primaryKey: 'id',
      allowedFields: ['supplier_id', 'purchase_date', 'invoice_number', 'total_amount', 'payment_status', 'remarks'],
      searchableFields: ['invoice_number', 'remarks'],
      sortableFields: ['id', 'purchase_date', 'invoice_number', 'total_amount', 'created_at', 'updated_at'],
      defaultSortColumn: 'purchase_date',
      defaultSortDirection: 'DESC',
    });
  }

  async findByInvoiceNumber(invoiceNumber) {
    return this.findOneBy('invoice_number', invoiceNumber);
  }
}

module.exports = new Purchase();
