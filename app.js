const express = require("express");
const userRouter = require("./routes/userRoute.js");
const authRouter = require("./routes/authRoute.js");
const otpRouter = require('./routes/otpRoute.js');
const eventRouter = require("./routes/eventRoute.js");
const dashboardRouter = require("./routes/dashboardRoute.js");
const calendarRouter = require("./routes/calendarRoute.js");
require('dotenv').config();

const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/user',userRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/otp' , otpRouter);
app.use('/api/v1/event' , eventRouter);
app.use('/api/v1/dashboard' , dashboardRouter);
app.use('/api/v1/calendar' , calendarRouter);

// sample app response main route 
app.get('/', (req,res)=>{
    res.send('hello from yi');
})


module.exports = app;