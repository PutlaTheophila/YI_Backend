const CustomError = require("../utils/customError.js");
const mongoose = require("mongoose");
const User = require('../models/userModel.js');
const asyncErrorHandler = require('../utils/asyncErrorHandler.js');
const { verifyToken } = require("../utils/jwt.js");
require('dotenv').config;


const createUser = asyncErrorHandler(async(req , res , next) =>{
    const data = req.body;
    const user = await User.create(data);
    res.status(200).json({
        status:'success',
        data:user
    })
})

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

const getAllUsers = asyncErrorHandler(async(req, res , next)=>{
    const users = await User.find({});
    await new Promise(res => setTimeout(res, 1000));
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


const updateUser = asyncErrorHandler(async(req, res)=>{
    const data = req.body;
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id , data);
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
    updateUser
}