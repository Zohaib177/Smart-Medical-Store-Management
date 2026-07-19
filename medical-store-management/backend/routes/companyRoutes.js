const express = require('express');
const authenticateAdmin = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const companyController = require('../controllers/companyController');
const { companyIdValidator, listCompaniesValidator, createCompanyValidator, updateCompanyValidator, updateCompanyStatusValidator } = require('../validators/companyValidators');

const router = express.Router();
router.use(authenticateAdmin);
router.get('/', listCompaniesValidator, validateRequest, companyController.listCompanies);
router.get('/:id', companyIdValidator, validateRequest, companyController.getCompany);
router.post('/', createCompanyValidator, validateRequest, companyController.createCompany);
router.put('/:id', companyIdValidator, updateCompanyValidator, validateRequest, companyController.updateCompany);
router.patch('/:id/status', companyIdValidator, updateCompanyStatusValidator, validateRequest, companyController.updateCompanyStatus);
router.delete('/:id', companyIdValidator, validateRequest, companyController.deleteCompany);

module.exports = router;
