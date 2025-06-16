const express = require('express');
const calendarRouter = express.Router();
const {sendEventDates} = require('../controllers/calendarController.js');

calendarRouter.route('/')
    .get(sendEventDates)

module.exports = calendarRouter;