const BaseModel = require('./BaseModel');

class Sale extends BaseModel {
  constructor() {
    super({
      tableName: 'sales',
      primaryKey: 'id',
      allowedFields: ['customer_id', 'invoice_number', 'sale_date', 'total_amount', 'discount', 'tax', 'grand_total', 'payment_method', 'payment_status'],
      searchableFields: ['invoice_number'],
      sortableFields: ['id', 'sale_date', 'invoice_number', 'grand_total', 'created_at', 'updated_at'],
      defaultSortColumn: 'sale_date',
      defaultSortDirection: 'DESC',
    });
  }

  async findByInvoiceNumber(invoiceNumber) {
    return this.findOneBy('invoice_number', invoiceNumber);
  }
}

module.exports = new Sale();
