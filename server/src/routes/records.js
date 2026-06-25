const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/recordsController');
const { validatePatientId } = require('../middleware/validation');

router.get('/:patientId', validatePatientId, recordsController.getRecords);
router.post('/:patientId', validatePatientId, recordsController.addRecord);
router.get('/:patientId/vitals', validatePatientId, recordsController.getVitals);

module.exports = router;
