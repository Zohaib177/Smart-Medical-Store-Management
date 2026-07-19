const http = require('http');
const config = require('./config/environment');
const app = require('./app');
const { testDatabaseConnection, closeDatabasePool } = require('./config/database');

let server;

async function startServer() {
  try {
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.error('Unable to start server because MySQL connection failed.');
      process.exit(1);
    }

    server = http.createServer(app);
    server.listen(config.port, () => {
      console.log(`Medical Store API running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
}

function gracefulShutdown(signal) {
  return async () => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    if (server) {
      server.close(async () => {
        await closeDatabasePool();
        process.exit(0);
      });
    } else {
      await closeDatabasePool();
      process.exit(0);
    }
  };
}

process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason instanceof Error ? reason.message : reason);
  process.exit(1);
});

startServer();
