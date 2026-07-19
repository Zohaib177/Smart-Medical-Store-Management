const express = require('express');
const { loginAdmin, refreshAdminToken, logoutAdmin, getAdminProfile } = require('../controllers/authController');
const authenticateAdmin = require('../middleware/authMiddleware');
const loginLimiter = require('../middleware/loginLimiter');
const validateRequest = require('../middleware/validateRequest');
const { loginValidator, refreshValidator, logoutValidator } = require('../validators/authValidators');

const router = express.Router();

router.post('/login', loginLimiter, loginValidator, validateRequest, loginAdmin);
router.post('/refresh', refreshValidator, validateRequest, refreshAdminToken);
router.post('/logout', logoutValidator, validateRequest, logoutAdmin);
router.get('/me', authenticateAdmin, getAdminProfile);

module.exports = router;
