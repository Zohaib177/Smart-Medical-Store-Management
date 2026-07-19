const http = require('http');
require('dotenv').config();

const app = require('./app');
const { pool, testDatabaseConnection } = require('./config/database');

const port = process.env.PORT || 5000;
let server;

async function startServer() {
  try {
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.error('Unable to start server because MySQL connection failed.');
      process.exit(1);
    }

    server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Medical Store API running on port ${port}`);
    });
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
}

function gracefulShutdown(signal) {
  return () => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    if (server) {
      server.close(() => {
        pool.end().then(() => {
          process.exit(0);
        });
      });
    } else {
      pool.end().then(() => {
        process.exit(0);
      });
    }
  };
}

process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));

startServer();
