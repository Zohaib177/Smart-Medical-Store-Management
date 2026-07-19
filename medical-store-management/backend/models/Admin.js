const BaseModel = require('./BaseModel');

class Admin extends BaseModel {
  constructor() {
    super({
      tableName: 'admins',
      primaryKey: 'id',
      allowedFields: ['full_name', 'email', 'password', 'phone', 'profile_image', 'status', 'last_login'],
      searchableFields: ['full_name', 'email', 'phone'],
      sortableFields: ['id', 'full_name', 'email', 'created_at', 'updated_at'],
      defaultSortColumn: 'created_at',
      defaultSortDirection: 'DESC',
    });
  }

  async findByEmail(email) {
    return this.findOneBy('email', email);
  }
}

module.exports = new Admin();
