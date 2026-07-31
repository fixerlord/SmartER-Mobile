const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/recordsController');

// Get user records using query param ?userId=X
router.get('/', recordsController.getRecords);

// Future endpoints
router.post('/:patientId', recordsController.addRecord);
router.get('/:patientId/vitals', recordsController.getVitals);

module.exports = router;
