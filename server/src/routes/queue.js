const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { validatePatientId, validatePriority } = require('../middleware/validation');

router.get('/', queueController.getQueue);
router.get('/priority/:level', queueController.getQueueByPriority);
router.put('/:patientId/priority', validatePatientId, validatePriority, queueController.updatePatientPriority);
router.get('/summary', queueController.getQueueSummary);

module.exports = router;
