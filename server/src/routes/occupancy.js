const express = require('express');
const router = express.Router();
const occupancyController = require('../controllers/occupancyController');

router.get('/', occupancyController.getOccupancy);
router.put('/', occupancyController.updateOccupancy);

module.exports = router;
