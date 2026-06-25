const express = require('express');
const router = express.Router();

const hospitalsRouter = require('./hospitals');
const arrivalsRouter = require('./arrivals');
const patientsRouter = require('./patients');
const triageRouter = require('./triage');
const queueRouter = require('./queue');
const chatRouter = require('./chat');
const occupancyRouter = require('./occupancy');
const recordsRouter = require('./records');

router.use('/hospitals', hospitalsRouter);
router.use('/arrivals', arrivalsRouter);
router.use('/patients', patientsRouter);
router.use('/triage', triageRouter);
router.use('/queue', queueRouter);
router.use('/chat', chatRouter);
router.use('/occupancy', occupancyRouter);
router.use('/records', recordsRouter);

module.exports = router;
