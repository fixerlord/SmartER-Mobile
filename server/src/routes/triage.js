const express = require('express');
const router = express.Router();
const triageController = require('../controllers/triageController');
const { validatePatientId, validatePriority } = require('../middleware/validation');

router.post('/', triageController.submitTriage);
router.get('/:patientId', validatePatientId, triageController.getTriageResponses);
router.put('/:patientId/priority', validatePatientId, validatePriority, triageController.updatePriority);

module.exports = router;
