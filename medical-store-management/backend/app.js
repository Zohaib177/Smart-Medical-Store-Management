const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const config = require('./config/environment');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const companyRoutes = require('./routes/companyRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const developmentRoutes = require('./routes/developmentRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin(origin, callback) {
    if (!origin || config.clientUrls.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
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
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/dashboard`, dashboardRoutes);
app.use(`${config.apiPrefix}/categories`, categoryRoutes);
app.use(`${config.apiPrefix}/companies`, companyRoutes);
app.use(`${config.apiPrefix}/medicines`, medicineRoutes);
app.use(`${config.apiPrefix}/inventory`, inventoryRoutes);
app.use(`${config.apiPrefix}/suppliers`, supplierRoutes);
app.use(`${config.apiPrefix}/purchases`, purchaseRoutes);

if (config.isDevelopment) {
  app.use(`${config.apiPrefix}/dev`, developmentRoutes);
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
