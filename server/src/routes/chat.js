const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validatePatientId } = require('../middleware/validation');

router.post('/:patientId/message', validatePatientId, chatController.sendMessage);
router.get('/:patientId/history', validatePatientId, chatController.getChatHistory);

module.exports = router;
