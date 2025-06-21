const Event = require('../models/eventModel.js');
const asyncErrorHandler = require('../utils/asyncErrorHandler.js');
const CustomError = require('../utils/customError.js');
const User = require('../models/userModel.js');
const { verify } = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt.js');

const createEvent = asyncErrorHandler(async(req , res)=>{
    try{
    const data = req.body;
    console.log(data , 'hello');
    if (!req.file) {
    return res.status(400).json({ error: 'Image required' });
    }
    console.log(req.file.path)
    const event = await Event.create({...data , bannerImageUrl : req.file.path });
    // await new Promise(res => setTimeout(res, 3000));
    console.log(data , 'his');
    res.status(200).json({
        status : 'success',
    })

    }catch(err){
        console.log(err)
    }

}) 

const getAllEvents = asyncErrorHandler(async(re, res)=>{
    const events = await Event.find({});
    res.status(200).json({
        status : 'success',
        nbHits : events.length,
        events
    })
})

const getEvent = asyncErrorHandler(async(req , res , next)=>{
    const id = await req.params.id;
    if(!id) next(new CustomError('invalid id of the event' , 400))
    const event = await Event.findById(id);
    console.log('hi form get event')
    if(!event) next(new CustomError('no event record found ' , 400))
    res.status(200).json({
        status : 'success',
        event
    })
})

const deleteEvent = asyncErrorHandler(async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
        return next(new CustomError('Invalid event ID', 400));
    }

    // 1. Delete the event
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
        return next(new CustomError('No event found with this ID', 404));
    }

    // 2. Remove this event ID from each user's events.rsvps array
    const rsvpUserIds = event.rsvps.map(r => r.userId);

    await Promise.all(
        rsvpUserIds.map(userId =>
        User.updateOne(
            { _id: userId },
            { $pull: { 'events.rsvps': id } }
        )
        )
    );

    res.status(200).json({
        status: 'success',
        message: 'Event deleted and removed from user RSVPs',
        event,
    });
});


const createEvents = asyncErrorHandler(async(req, res)=>{
    const data = await req.body;
    const events = await Event.insertMany(data);
    res.status(200).json({
        status:'success',
        events
    })

})


const rsvpEvent = asyncErrorHandler(async (req, res, next) => {
  const token = req.headers.token;
  if (!token) return next(new CustomError('Token missing', 401));

  const {id:userId} = await verifyToken(token);
  const eventId = req.params.id;

  const user = await User.findById(userId);
  if (!eventId) return next(new CustomError('No event ID provided', 400));

    await new Promise(res => setTimeout(res, 3000));
  const event = await Event.findById(eventId);
  if (!event) return next(new CustomError('Event not found', 404));

  // ✅ Check if user already RSVPed
  const alreadyRSVPed = user.events.rsvps.includes(eventId);

  if (alreadyRSVPed) {
    return res.status(200).json({
      status: 'success',
      message: 'Already RSVPed',
    });
  }

  // ✅ Add to event.rsvps
  event.rsvps.push({ userId });
  await event.save();

  // ✅ Add to user.events.rsvps
  await User.findByIdAndUpdate(userId, {
    $addToSet: { 'events.rsvps': eventId }, // ensures no duplicate event IDs in user
  });

  res.status(200).json({
    status: 'success',
    message: 'RSVP added',
  });
});



const getEventsForEventsScreen  = asyncErrorHandler(async(req, res, next)=>{
        console.log(req.query);
    const { tags, offset = 0, limit = 10 } = req.query;
    await new Promise(res => setTimeout(res, 2000));
    console.log(req.query);
  const tagList = tags ? tags.split(',') : [];

  const filter = tagList.length > 0
    ? { tags: { $all: tagList } } // Match events that include *all* selected tags
    : {};

  const events = await Event.find(filter)
    .sort({ date: -1 }) // optional
    .skip(Number(offset))
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    events,
  });
})


//68535dacf2e0d84aed099f7b

module.exports = {
    createEvent , getAllEvents , getEvent , deleteEvent , createEvents , rsvpEvent , getEventsForEventsScreen
}