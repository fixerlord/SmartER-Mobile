const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const queueController = require('../controllers/queueController');

// NOTE: Specific routes must come BEFORE parameterized routes like /:id
router.get('/nearby', hospitalController.getRecommendations);
router.get('/recommendations', hospitalController.getRecommendations); // Keep old for compat
router.get('/', hospitalController.getAllHospitals);
router.get('/:id(\\d+)', hospitalController.getHospitalById);
router.get('/:id/queue', queueController.getHospitalQueue);
router.get('/:id/dashboard', hospitalController.getDashboard);

module.exports = router;
