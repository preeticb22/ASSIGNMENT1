const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.post('/', eventController.addEvent);
router.get('/', eventController.getEvents);

module.exports = router;
