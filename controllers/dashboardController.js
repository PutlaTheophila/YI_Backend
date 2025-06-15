const Event = require('../models/eventModel');
const User = require('../models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

const {verifyToken} = require('../utils/jwt');


const sendData = asyncErrorHandler(async(req ,res)=>{
    const token = req.headers.token;
    const data =  await verifyToken(token);
    console.log(data.id);//this is user id

    const user = await User.findById(data.id);
    const userName = user?.name.split(' ')[0];
    const userProfile = user?.profilePhotoUrl;

    const rsvps = user.events.rsvps;
    let rsvpEvents = [];
    rsvps.forEach(async (id , index)=>{
        let event = await Event.findById(id);
        rsvpEvents.push(event);
    })
    const events = await Event.find({});
    const now = new Date();
    const eventStats = await Event.aggregate([
      // Step 1: Filter only future events
      { $match: { date: { $gt: now }, isDeleted: false, isPublished: true } },

      // Step 2: Unwind the tags array so each tag can be individually grouped
      { $unwind: '$tags' },

      // Step 3: Filter tags to only INTEREST_TAGS (exclude system tags)
      {
        $match: {
          tags: {
            $in: [
              'Travel', 'Music', 'Fitness', 'Sports', 'Reading', 'Food & Cooking',
              'Photography', 'Art & Design', 'Fashion', 'Tech & Gadgets',
              'Yoga & Wellness', 'Golf', 'Trekking', 'Writing', 'Startups & Innovation',
              'Volunteering', 'Film & Theatre', 'Dancing', 'Public Speaking', 'Investing'
            ]
          }
        }
      },

      // Step 4: Group by tag to count RSVPs and number of events
      {
        $group: {
          _id: '$tags',
          rsvpCount: { $sum: { $size: '$rsvps' } },
          eventCount: { $sum: 1 }
        }
      },

      // Step 5: Sort by total RSVP count (descending)
      { $sort: { rsvpCount: -1 } },

      // Step 6: Take top 4
      { $limit: 4 },

      // Step 7: Rename fields for clarity
      {
        $project: {
          _id: 0,
          tag: '$_id',
          rsvpCount: 1,
          eventCount: 1
        }
      }
    ]);


    res.status(200).json({
        status:'success',
        data:{
            userName,
            userProfile,
            events,
            eventStats,
            rsvpEvents
        }
    })
})


module.exports = {sendData}