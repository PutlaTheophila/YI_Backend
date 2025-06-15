console.log('hi');
const mongoose = require("mongoose");
const app = require('./app.js');
require('dotenv').config();


mongoose.connect(`mongodb+srv://putlatheophila123:${process.env.MONGO_DB_SECRET}@cluster0.wzgjhzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(()=>{
    console.log('connected to DB');
    app.listen(process.env.PORT , ()=>{
        console.log(`app is listening on port ${process.env.PORT}`);
    })
})




