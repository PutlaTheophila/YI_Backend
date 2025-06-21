const { ContentInstance } = require("twilio/lib/rest/content/v1/content");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const {verifyToken} = require('../utils/jwt.js');
const Event = require('../models/eventModel.js');
const User = require('../models/userModel.js');
const mongoose = require('mongoose');

const sendEventDates = asyncErrorHandler(async(req,res)=>{
    console.log('sending...');
    const token = req.headers.token;
    const data =  await verifyToken(token);
    console.log(data.id);
    //  const userId = new mongoose.Types.ObjectId(data.id);
    const allEvents = await Event.find({}, 'title date');
 const user = await User.findById(data.id).populate({
    path: 'events.rsvps',
    select: 'title date'
  });

  const userRSVPedEvents = user?.events?.rsvps || [];

  res.status(200).json({
    status: 'success',
    data: {
      allEvents,
      userRSVPedEvents
    }
  });
});


const sendEventsForDate = asyncErrorHandler(async (req, res) => {
  const dateStr = req.params.date; // e.g., "2025-07-05"

  const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

  const events = await Event.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  res.status(200).json({
    status: 'success',
    events,
  });
});






module.exports = {
    sendEventDates,
    sendEventsForDate
}