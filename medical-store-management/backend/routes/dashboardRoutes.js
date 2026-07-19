const express = require('express');
const authenticateAdmin = require('../middleware/authMiddleware');
const { getSummary } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/summary', authenticateAdmin, getSummary);

module.exports = router;
