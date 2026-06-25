const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const queueController = require('../controllers/queueController');

router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.get('/:id/queue', queueController.getHospitalQueue);

module.exports = router;
