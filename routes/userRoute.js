const express = require("express");
const userRouter = express.Router();
const {createUser, getAllUsers, getUser, deleteUser , userProfile, updateUser} = require("../controllers/userController.js");
const { protect } = require('../utils/jwt.js')

userRouter.route('/')
    .post(createUser)
    .get(getAllUsers)


userRouter.route('/profile')
    .get(userProfile)

userRouter.route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser)

module.exports = userRouter;

