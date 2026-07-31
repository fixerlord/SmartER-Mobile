const express = require('express');
const router = express.Router();
const arrivalController = require('../controllers/arrivalController');

router.post('/', arrivalController.createArrival);
router.get('/latest', arrivalController.getLatestArrival);
router.get('/', arrivalController.getAllArrivals);
router.get('/:id/details', arrivalController.getArrivalDetails);
router.get('/:id', arrivalController.getArrivalById);
router.put('/:id/priority', arrivalController.updatePriority);

module.exports = router;
