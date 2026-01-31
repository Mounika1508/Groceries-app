const Category = require("../models/category-model");
const Vendor = require("../models/vendor-model");
const categoryValidationSchema = require("../validations/category-validation");
const categoryCtlr = {};        
//creating category
categoryCtlr.create = async (req, res) => {
    try{    
        const body = req.body;
        const userId = req.userId;     
        const {error, value} = categoryValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }   
        const vendor = await Vendor.findOne({userId});
        if(!vendor){
            return res.status(404).json({message: "Vendor profile not found"});
        }  
        if(!vendor.isApproved){
            return res.status(403).json({message: "Your vendor account is not approved yet"});
        }     
        const existingCategory = await Category.findOne({name: value.name, vendorId: vendor._id});
        if(existingCategory){
            return res.status(400).json({message: "Category with this name already exists"});
        }   
        const category = await Category.create({        
            name: value.name,     
            imageUrl: value.imageUrl,
            vendorId: vendor._id
        }); 
        res.status(201).json(category); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

categoryCtlr.list = async (req, res) => {
    try{
        const vendor = await Vendor.findOne({userId: req.userId});
        if(!vendor){
            return res.status(404).json({message: "Vendor profile not found"});
        }   
        const categories = await Category.find({vendorId: vendor._id}).populate('vendorId', 'shopName') ;
        res.json(categories);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }       
}

categoryCtlr.publicList = async (req, res) => {
    try{
        const vendorId = req.params.vendorId;
        const categories = await Category.find({vendorId}).populate('vendorId', 'shopName') ;
        res.json(categories);
    }   
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

categoryCtlr.update = async (req, res) => {
    try{
        const id =  req.params.id;  
        const body = req.body;
        const {error, value} = categoryValidationSchema.validate(body, {abortEarly: false});        
        if(error){
            return res.status(400).json({error: error.details});            
        }   
        const vendor = await Vendor.findOne({userId: req.userId});
        if(!vendor){
            return res.status(404).json({message: "Vendor profile not found"});
        }   
        const category = await Category.findOneAndUpdate({_id: id, vendorId: vendor._id}, value, {new: true}).populate('vendorId', 'shopName')  ;      
        if(!category){    
            return  res.status(404).json({message: "Category not found or you are not authorized to update"});
        }
        res.json(category);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

categoryCtlr.remove = async (req, res) => {
    try{
        const id = req.params.id;   
        const vendor = await Vendor.findOne({userId: req.userId});
        if(!vendor){
            return res.status(404).json({message: "Vendor profile not found"});
        }
        const category = await Category.findOneAndDelete({_id: id, vendorId: vendor._id});
        if(!category){
            return res.status(404).json({message: "Category not found or you are not authorized to delete"});
        }
        res.json({message: "Category deleted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

module.exports = categoryCtlr;