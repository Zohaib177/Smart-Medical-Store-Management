const mysql = require('mysql2/promise');
const config = require('./environment');

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: config.database.connectionLimit,
  queueLimit: 0,
  enableKeepAlive: true,
  charset: 'utf8mb4_unicode_ci',
});

async function testDatabaseConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1 AS database_status');
    if (rows && rows.length > 0) {
      console.log('MySQL database connected successfully.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Unable to connect to MySQL database.');
    return false;
  }
}

async function closeDatabasePool() {
  await pool.end();
}

module.exports = {
  pool,
  testDatabaseConnection,
  closeDatabasePool,
};
