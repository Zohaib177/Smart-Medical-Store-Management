const BaseModel = require('./BaseModel');
const crypto = require('crypto');
const { executeQuery } = require('../services/databaseService');

class AdminRefreshToken extends BaseModel {
  constructor() {
    super({
      tableName: 'admin_refresh_tokens',
      primaryKey: 'id',
      allowedFields: ['admin_id', 'token_hash', 'expires_at', 'revoked_at'],
      searchableFields: [],
      sortableFields: ['id', 'created_at', 'updated_at'],
      defaultSortColumn: 'created_at',
      defaultSortDirection: 'DESC',
    });
  }

  async createTokenRecord(adminId, rawRefreshToken, expiresAt) {
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    return this.create({
      admin_id: adminId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });
  }

  async findActiveTokenRecord(adminId, rawRefreshToken) {
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const rows = await executeQuery(
      `SELECT * FROM ${this.tableName} WHERE admin_id = ? AND token_hash = ? AND revoked_at IS NULL AND expires_at > NOW() ORDER BY id DESC LIMIT 1`,
      [adminId, tokenHash]
    );

    return rows[0] || null;
  }

  async revokeTokenRecord(adminId, rawRefreshToken) {
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    return executeQuery(
      `UPDATE ${this.tableName} SET revoked_at = NOW(), updated_at = NOW() WHERE admin_id = ? AND token_hash = ? AND revoked_at IS NULL`,
      [adminId, tokenHash]
    );
  }

  async revokeAllForAdmin(adminId) {
    return executeQuery(
      `UPDATE ${this.tableName} SET revoked_at = NOW(), updated_at = NOW() WHERE admin_id = ? AND revoked_at IS NULL`,
      [adminId]
    );
  }

  async deleteExpiredTokens() {
    return executeQuery(`DELETE FROM ${this.tableName} WHERE expires_at <= NOW() OR revoked_at IS NOT NULL`);
  }
}

module.exports = new AdminRefreshToken();
