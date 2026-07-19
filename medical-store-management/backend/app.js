const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/environment');

const healthRoutes = require('./routes/healthRoutes');
const developmentRoutes = require('./routes/developmentRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: config.clientUrl,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());

if (config.isDevelopment) {
  app.use(morgan('dev'));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(config.apiPrefix, apiLimiter);

app.get(config.apiPrefix, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Medical Store Management API',
  });
});

app.use(`${config.apiPrefix}/health`, healthRoutes);

if (config.isDevelopment) {
  app.use(`${config.apiPrefix}/dev`, developmentRoutes);
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
