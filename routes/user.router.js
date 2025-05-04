const express = require('express'); 
const { check } = require('express-validator'); 
const { signinUser, signupUser, updateUser, deleteUser } = require('../controllers/user.controller');
//const auth = require('../middleware/auth')
//const isAdmin = require('../middleware/isAdmin')

let userRouter = express.Router();

userRouter.post("/signin", [
    check('email').isEmail().withMessage("Invalid email format"), 
    check('password').notEmpty().withMessage("password is required.")
], signinUser); 

userRouter.post("/signup", [
    check("email").isEmail().withMessage("Invalid email format"), 
    check("password").notEmpty().withMessage("Password is required")
], signupUser)

userRouter.patch("/:id", updateUser); 

userRouter.delete("/:id", deleteUser)

module.exports = userRouter;
