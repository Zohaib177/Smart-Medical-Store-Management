const { pool } = require('../config/database');

async function getHealth(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT 1 AS database_status');
    const timestamp = new Date().toISOString();

    if (rows && rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Medical Store API is running',
        server: 'connected',
        database: 'connected',
        timestamp,
      });
    }

    return res.status(503).json({
      success: false,
      message: 'API is running, but the database connection failed',
      server: 'connected',
      database: 'disconnected',
      timestamp,
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'API is running, but the database connection failed',
      server: 'connected',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = {
  getHealth,
};
