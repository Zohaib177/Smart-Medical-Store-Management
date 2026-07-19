const express = require('express');
const authenticateAdmin = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const controller = require('../controllers/medicineController');
const { medicineIdValidator, listMedicinesValidator, createMedicineValidator, updateMedicineValidator, updateMedicineStatusValidator } = require('../validators/medicineValidators');

const router = express.Router();
router.use(authenticateAdmin);
router.get('/', listMedicinesValidator, validateRequest, controller.listMedicines);
router.get('/options', controller.getMedicineOptions);
router.get('/:id', medicineIdValidator, validateRequest, controller.getMedicine);
router.post('/', createMedicineValidator, validateRequest, controller.createMedicine);
router.put('/:id', medicineIdValidator, updateMedicineValidator, validateRequest, controller.updateMedicine);
router.patch('/:id/status', medicineIdValidator, updateMedicineStatusValidator, validateRequest, controller.updateMedicineStatus);
router.delete('/:id', medicineIdValidator, validateRequest, controller.deleteMedicine);
module.exports = router;
