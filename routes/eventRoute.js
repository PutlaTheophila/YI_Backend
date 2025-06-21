const express = require('express');
const { getAllEvents, createEvent, getEvent, deleteEvent , createEvents, rsvpEvent, getEventsForEventsScreen} = require('../controllers/eventController');
const upload = require('../mw/cloudinaryMiddleware.js');
const eventRouter = express.Router();



eventRouter.route('/')
    .get(getAllEvents)

eventRouter.route('/')
    .post(upload.single('image'),createEvent)
    // .post(upload.any(),createEvent)

    eventRouter.route('/allevents')
    .get(getEventsForEventsScreen)

eventRouter.route('/:id')
    .get(getEvent)
    .delete(deleteEvent)

eventRouter.route('/createmultiple')
  .post(createEvents)

eventRouter.route('/rsvpevent/:id')
    .get(rsvpEvent)

eventRouter.route('/allevents')
    .get(getEventsForEventsScreen)


module.exports = eventRouter;