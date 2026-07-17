const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const queueController = require('../controllers/queueController');
const recommendationsController = require('../controllers/recommendationsController');

router.get('/recommendations', recommendationsController.getRecommendations);
router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.get('/:id/queue', queueController.getHospitalQueue);
router.get('/:id/dashboard', hospitalController.getDashboard);

module.exports = router;
