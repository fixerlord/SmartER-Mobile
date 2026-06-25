const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { validatePatientId } = require('../middleware/validation');

router.post('/', patientController.createPatient);
router.get('/:id', validatePatientId, patientController.getPatient);
router.put('/:id', validatePatientId, patientController.updatePatient);
router.delete('/:id', validatePatientId, patientController.deletePatient);
router.post('/:id/checkin', validatePatientId, patientController.checkIn);
router.get('/:id/status', validatePatientId, patientController.getStatus);

module.exports = router;
