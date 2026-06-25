const express = require('express');
const router = express.Router();
const arrivalController = require('../controllers/arrivalController');

router.post('/', arrivalController.createArrival);
router.get('/', arrivalController.getAllArrivals);
router.get('/:id', arrivalController.getArrivalById);

module.exports = router;
