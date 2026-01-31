const User = require('../models/user-model');
const Vendor = require('../models/vendor-model');
//const Admin = require("../models/admin-model");
const DeliveryBoy = require("../models/deliveryBoy-model")
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')
const { userRegisterSchema, userLoginSchema } = require('../validations/user-validation');
//const strongEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
//const strongPassword = /^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/
const userCtlr = {};


userCtlr.register = async (req, res) => {
    const body = req.body;
    const { error, value } = userRegisterSchema.validate(body, {abortEarly: false});
    if(error){
        return res.status(400).json({error: error.details});
    }
    try{
        const emailExists = await User.findOne({email: value.email});
        if(emailExists){
            return res.status(400).json({error: 'Email already taken'})
        }
        if(value.role === 'admin'){
            const adminExists = await User.findOne({role: 'admin'});
            if(adminExists){
                return res.status(403).json({error: 'Admin account already exists'})
            }
        }
        const user = new User(value);
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(user.password, salt);
        user.password = hash;
        await user.save();
        res.status(201).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Something went wrong!!'})
    }
}


userCtlr.login = async (req, res) => {
    const body = req.body;
    const {error, value } = userLoginSchema.validate(body, {abortEarly: false});
    if(error){
        return res.status(400).json({message: error.details})
    }
    const user = await User.findOne({email: value.email});
    if(!user){
        return res.status(401).json({error: 'Invalid email / password'});
    }
    const passwordMatch = await bcryptjs.compare(value.password, user.password);
    if(!passwordMatch){
        return res.status(401).json({error: 'Invalid email / password'})
    }
    //await User.findByIdAndUpdate(user._id, { $inc: {clickCount: 1 }})
    const tokenData = {userId: user._id, role: user.role};
    const token = jwt.sign(tokenData, process.env.JWT_SECRET);
    res.json({token: token});
}

userCtlr.list = async (req, res) => {
    try{
        const user = await User.find().select("-password  ");
        res.json(user)
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"})
    }
}

userCtlr.account = async (req, res) => {
    try{
        const user = await User.findById(req.userId);
        res.json(user);
    }catch(err){
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}

userCtlr.show = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        res.json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"})
    }
}

userCtlr.remove = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        res.json({message:`${user.username} deleted successfully`})
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"})
    }
}

module.exports = userCtlr;