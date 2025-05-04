const mongoose = require('mongoose');
const users = require('../db/models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator'); 
const { ObjectId } = require('mongodb');

const signinUser = async (req, res) => {
    let errors = validationResult(req); 
    let body = req.body; 

    if(!errors.isEmpty()){
        return res.status(400).json({success: false, message: errors.array()[0].message})
    }

    if(!body || !body.email || !body.password) {
        return res.status(400).json({success: false, message: "please check credentials."})
    }

    query = {
        email: body.email
    }
    let user = await users.findOne(query); 
    if(!user){
        return res.status(404).json({success: false, message: "user not found."})
    }

    const isPasswordMatched = await bcrypt.compare(body.password, user.password);
    if(!isPasswordMatched){
        return res.status(404).json({success: false, message: "password incorrect."})
    }

    const payload = {
        userId: user._id, 
        type: user.type || 0, 
        name: user.name
    }

    const tokensecret = process.env.TOKEN_SECRET; 
    jwt.sign(payload, tokensecret, {
        expiresIn: 7200
    }, (err, token) => {
        if(err) {
            return res.status(500).json({success: false, message: "Internal server error"})
        }

        res.status(200).json({success: true, token})
    })
}

let signupUser = async (req, res) => {
    console.log('Signup request received:', req.body);
    let errors = validationResult(req); 
    let body = req.body; 

    if(!errors.isEmpty()) {
        return res.status(400).json({success: false, message: errors.array()[0].msg})
    }

    let existinguser = await users.findOne({
        email: body.email
    })

    if(existinguser) {
        return res.status(404).json({success: false, message: "user already signed up"})
    }

    const salt = await bcrypt.genSalt(11); 
    let newuser = new users({
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, salt),
        phone: body.phone,
        type: body.type
    });
    await newuser.save();
    console.log("database: ", mongoose.connection.name)
    return res.status(200).json({success: true, message: "user signed up successfully."})
}

let updateUser = async (req, res) => {
    let userId = req.params.id; 
    const {name, phone} = req.body; 
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const user = await users.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    let updatedUser = {}; 
    if(name){
        updatedUser.name = name;
    }
    if(phone) {
        updatedUser.phone = phone; 
    }
    await users.updateOne(
        {_id: (userId)},
        {$set: updatedUser}
    )
    res.status(200).json({success: true, message: "user updated successfully."})
}

let deleteUser = async (req, res) => {
    let userId = req.params.id; 
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const user = await users.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    await users.deleteOne({
        _id: (userId)
    })

    res.status(200).json({success: true, message: "user deleted successfully"})
}

module.exports = {
    signinUser, 
    signupUser, 
    updateUser, 
    deleteUser
}
    


