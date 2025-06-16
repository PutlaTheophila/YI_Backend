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





module.exports = {
    sendEventDates
}