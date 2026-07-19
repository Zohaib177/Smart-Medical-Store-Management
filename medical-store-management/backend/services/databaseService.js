const { pool } = require('../config/database');
const ApiError = require('../utils/ApiError');

async function executeQuery(sql, parameters = []) {
  try {
    const [rows] = await pool.execute(sql, parameters);
    return rows;
  } catch (error) {
    throw new ApiError(500, 'Database query failed', 'DATABASE_QUERY_FAILED', { message: error.message });
  }
}

async function executeSingle(sql, parameters = []) {
  const rows = await executeQuery(sql, parameters);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function beginTransaction() {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
}

async function commitTransaction(connection) {
  if (!connection) {
    return;
  }
  await connection.commit();
}

async function rollbackTransaction(connection) {
  if (!connection) {
    return;
  }
  await connection.rollback();
}

async function releaseConnection(connection) {
  if (connection) {
    connection.release();
  }
}

async function withTransaction(callback) {
  const connection = await beginTransaction();
  try {
    const result = await callback(connection);
    await commitTransaction(connection);
    return result;
  } catch (error) {
    await rollbackTransaction(connection);
    throw error;
  } finally {
    await releaseConnection(connection);
  }
}

module.exports = {
  executeQuery,
  executeSingle,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  releaseConnection,
  withTransaction,
};
