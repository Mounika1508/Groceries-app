const Customer = require('../models/customer-model');
const User = require('../models/user-model');
const customerValidationSchema = require('../validations/customer-validation');
const customerCtlr = {};

customerCtlr.create = async (req, res) => {
    try{
        const body = req.body;
        const userId = req.userId;
        if(req.role !== 'customer'){
            return res.status(403).json({message: "Only customers can create customer profiles"});
        }
        const {error, value} = customerValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }
        const existingCustomer = await Customer.findOne({userId});
        if(existingCustomer){
            return res.status(400).json({message: "Customer profile already exists for this user"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const existingEmailCustomer = await Customer.findOne({email: user.email});
        if(existingEmailCustomer){
            return res.status(400).json({message: "Customer profile with this email already exists"});
        }
        const customer = await Customer.create({
            userId,
            username: user.username,
            email: user.email,
            phone: value.phone,
            address: value.address,
            city: value.city
        });
        await customer.save();
        res.status(201).json(customer);
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }           
}

customerCtlr.getProfile = async (req, res) => {
    try{
        const userId = req.userId;  
        const customer = await Customer.findOne({userId});
        if(!customer){
            return res.status(404).json({message: "Customer profile not found"});
        }       
        res.json(customer); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

customerCtlr.list = async (req, res) => {
    try{
        const customers = await Customer.find();    
        res.json(customers);
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

customerCtlr.remove = async (req, res) => {
    try{
        const id = req.params.id;
        const customer = await Customer.findOneAndDelete({_id: id});
        if(!customer){
            return res.status(404).json({message: "Customer not found"});
        }
        res.json({message:`${customer.username} deleted successfully`})
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

customerCtlr.show = async (req, res) => {
    try{
        const id = req.params.id;
        const customer = await Customer.findById(id);
        if(!customer){
            return res.status(404).json({message: "Customer not found"});
        }   
        res.json(customer);
    }catch(err){        
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

customerCtlr.update = async (req, res) => {
    try{
        const id = req.params.id;
        const body = req.body;
        const {error, value} = customerValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }   
        const updatedCustomer = await Customer.findOneAndUpdate({_id: id, userId: req.userId}, value, {new: true});
        if(!updatedCustomer){
            return res.status(404).json({message: "Customer not found"});
        }   
        res.json(updatedCustomer);
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }           
}   

module.exports = customerCtlr;

