const express = require('express');
const {
  getDatabaseSummary,
  getStoreSettings,
  getCategories,
  getCompanies,
} = require('../controllers/developmentController');

const router = express.Router();

router.get('/database-summary', getDatabaseSummary);
router.get('/store-settings', getStoreSettings);
router.get('/categories', getCategories);
router.get('/companies', getCompanies);

module.exports = router;
