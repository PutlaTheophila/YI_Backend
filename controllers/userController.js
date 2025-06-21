const CustomError = require("../utils/customError.js");
const mongoose = require("mongoose");
const User = require('../models/userModel.js');
const asyncErrorHandler = require('../utils/asyncErrorHandler.js');
const { verifyToken, createToken } = require("../utils/jwt.js");
require('dotenv').config;


const parseIfString = (val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (e) {
      return [];
    }
  }
  return val;
};

const createUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const body = req.body;
    console.log(req.body);
    let parsedData = {
    name: body.name,
    mobile: body.mobile,
    dateOfBirth: new Date(body.dateOfBirth),
        industry : parseIfString(req.body.industry),
    interestAreas : parseIfString(req.body.interestAreas),

    yiRole: body.yiRole || 'Member',                  
    yiTeam: body.yiTeam || 'not-specified',                  
    yiMytri: body.yiMytri || 'not-specified',              
    yiProjects: body.yiProjects || 'not-specified',         
    yiInitiatives: body.yiInitiatives|| "not-specified"   
    };

    console.log(parsedData);

    // 🖼 If using multer with image upload
    if (req.file) {
        parsedData = {...parsedData , profilePhotoUrl : req.file.path};
        console.log(req.file.path); // or full path if you're storing URLs
    }

    const user = await User.create(parsedData);

    const token = await createToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data:user
    });
  } catch (error) {
    next(error); // will hit your global error handler
  }
});


const getUser = asyncErrorHandler(async (req  , res , next)=>{    
    const id = req.params.id;
    const user = await User.find({_id:id});
    res.status(200).json({
        status:'sucess',
        data:{
            user
        }
    })
})

const userProfile = asyncErrorHandler(async(req , res , next)=>{
     console.log(req.headers.token);
    const token = req.headers.token;
    const data =  await verifyToken(token);
    console.log(data);
    console.log('user data',data.id);
    if(!token) next(new CustomError('un-authorized please login' , 404));
    const user = await User.findOne({_id:data.id});
    // await new Promise(res => setTimeout(res, 1000));
    res.status(200).json({        
        status:'sucess',
        data:{
            user
        }
    })
})


const updateUser = asyncErrorHandler(async(req , res , next)=>{
    const token = await req.headers.token;
    if(!token){

    }
    const {id:userId} = await verifyToken(token);
    const user = await User.findById(id);
    if(req.file){

    }

})


const getAllUsers = asyncErrorHandler(async(req, res , next)=>{
    const users = await User.find({});
    // await new Promise(res => setTimeout(res, 1000));
    res.status(200).json({
        status : "success",
        data : users
    })
})

const deleteUser = asyncErrorHandler(async(req,res)=>{
    const id = req.params.id;
    console.log(id);
    const user = await User.findByIdAndDelete(id);
    if(!user){
        return next(new CustomError('user not found ' , 404));
    }
    res.status(200).json({
        status : "success",
        data : "successfully deleted the user "
    })
})


const updateUserProfile = asyncErrorHandler(async(req, res)=>{
    const data = req.body;
    const body = req.body;
    console.log(body);
    const token = req.headers.token;
    console.log('token: ',token);
    const {id:userId} = await verifyToken(token);
    console.log(await verifyToken(token));
    console.log('id is ', userId);
    let parsedData = {
        yiRole: body.yiRole || 'Member',                  
        yiTeam: body.yiTeam || 'NA',                  
        yiMytri: body.yiMytri || 'NA',              
        yiProjects: body.yiProjects || 'NA',         
        yiInitiatives: body.yiInitiatives|| "NA" 
    }
    if(req.file){
       parsedData =  {...parsedData , profilePhotoUrl:req.file.path}
    }
    console.log(parsedData);
    await User.findByIdAndUpdate(userId, parsedData);
    const user = await User.findByIdAndUpdate(userId);
    res.status(200).json({
        status:'success',
        user
    })
})


module.exports = {
    createUser,
    getUser,
    getAllUsers,
    deleteUser,
    userProfile,
    updateUser,
    updateUserProfile
}