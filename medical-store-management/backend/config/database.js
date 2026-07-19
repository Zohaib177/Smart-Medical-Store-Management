const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medical_store_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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

module.exports = {
  pool,
  testDatabaseConnection,
};
