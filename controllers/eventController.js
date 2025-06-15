const Event = require('../models/eventModel.js');
const asyncErrorHandler = require('../utils/asyncErrorHandler.js');
const CustomError = require('../utils/customError.js');

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



// const createEvent = asyncErrorHandler(async (req, res) => {

//   const data = req.body;
//   console.log(data);
//   const files = req.file.path;

//   // Parse JSON fields
//   const parsedTags = JSON.parse(data.tags || '[]');
//   const parsedAttendees = JSON.parse(data.attendees || '[]');

//   // ✅ Banner image
//   const bannerFile = files.find((f) => f.fieldname === 'image');
//   console.log('theo',bannerFile.path);
//   if (!bannerFile) {
//     return res.status(400).json({ error: 'Banner image is required' });
//   }

//   const venue = {
//     isOnline: data.isOnline === 'true',
//     name: data.venueName || '',
//     address: data.venueAddress || '',
//     locationLink: data.locationLink || '',
//   };

//   const newEvent = await Event.create({
//     title: data.title || 'sample',
//     subTitle: data.subTitle || '',
//     description: data.description || '',
//     bannerImageUrl: bannerFile.path,
//     category: data.category,
//     tags: parsedTags,
//     date: data.startDate, // required
//     endDate: data.endDate || null,
//     rsvpDeadline: data.rsvpDeadline || null,
//     maxCapacity: data.maxCapacity || null,
//     venue,
//     // attendees: attendeeData,

//     // These are system-generated / optional
//     createdBy: req.user?._id || undefined, // Optional: populate from auth middleware
//     isPublished: false,
//     isDeleted: false,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: newEvent,
//   });
// });



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
    if(!event) next(new CustomError('no event record found ' , 400))
    res.status(200).json({
        status : 'success',
        event
    })
})

const deleteEvent = asyncErrorHandler(async(req, res)=>{
    const id = req.params.id
    if(!id) next(new CustomError('invalid id of the event' , 400))
    const event = await Event.findByIdAndDelete(id)
    if(!event) next(new CustomError('no event record found ' , 400))
    res.status(200).json({
        status : 'success',
        event
    })
})

const createEvents = asyncErrorHandler(async(req, res)=>{
    const data = await req.body;
    const events = await Event.insertMany(data);
    res.status(200).json({
        status:'success',
        events
    })

})

module.exports = {
    createEvent , getAllEvents , getEvent , deleteEvent , createEvents
}