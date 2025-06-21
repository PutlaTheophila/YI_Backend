const express = require("express");
const userRouter = express.Router();
const {createUser, getAllUsers, getUser, deleteUser , userProfile, updateUser, updateUserProfile} = require("../controllers/userController.js");
const { protect } = require('../utils/jwt.js')
const upload = require('../mw/cloudinaryMiddleware.js');
userRouter.route('/')
    .post(upload.single('profilePhoto'),createUser)
    .get(getAllUsers)


userRouter.route('/profile')
    .get(userProfile)
    .patch(upload.single('profilePhoto'),updateUserProfile)

userRouter.route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser)

module.exports = userRouter;

