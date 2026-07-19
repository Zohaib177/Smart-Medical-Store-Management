const BaseModel = require('./BaseModel');

class SystemSetting extends BaseModel {
  constructor() {
    super({
      tableName: 'system_settings',
      primaryKey: 'id',
      allowedFields: ['store_name', 'store_email', 'store_phone', 'store_address'],
      searchableFields: ['store_name', 'store_email', 'store_phone', 'store_address'],
      sortableFields: ['id', 'store_name', 'created_at', 'updated_at'],
      defaultSortColumn: 'id',
      defaultSortDirection: 'ASC',
    });
  }

  async getStoreSettings() {
    const [rows] = await this.executeQuery('SELECT * FROM system_settings ORDER BY id DESC LIMIT 1');
    return rows[0] || null;
  }
}

module.exports = new SystemSetting();
