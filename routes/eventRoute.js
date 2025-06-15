const express = require('express');
const { getAllEvents, createEvent, getEvent, deleteEvent , createEvents} = require('../controllers/eventController');
const upload = require('../mw/cloudinaryMiddleware.js');
const eventRouter = express.Router();



eventRouter.route('/')
    .get(getAllEvents)

eventRouter.route('/')
    .post(upload.single('image'),createEvent)
    // .post(upload.any(),createEvent)

eventRouter.route('/:id')
    .get(getEvent)
    .delete(deleteEvent)

eventRouter.route('/createmultiple')
  .post(createEvents)


module.exports = eventRouter;