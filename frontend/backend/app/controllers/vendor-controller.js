const Vendor = require("../models/vendor-model");
const vendorValidationSchema = require("../validations/vendor-validation"); 
const vendorCtlr = {};

vendorCtlr.create = async (req, res) => {
    try{
        const body = req.body;  
        const userId = req.userId;
        if(req.role !== 'vendor'){
            return res.status(403).json({message: "Only vendors can create vendor profiles"});
        }           
        const {error, value} = vendorValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }   
        const existingVendor = await Vendor.findOne({userId});
        if(existingVendor){
            return res.status(400).json({message: "Vendor profile already exists for this user"});
        }   
        const vendor = await Vendor.create({        
            userId, 
            shopName: value.shopName,
            phone: value.phone,
            address: value.address, 
            city: value.cit
        });
        const populatedVendor = await Vendor.findById(vendor._id).populate('userId', '_id username ');
        res.status(201).json(populatedVendor);
    }       
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }       
}       

vendorCtlr.list = async (req, res) => {
    try{
        const vendors = await Vendor.find();
        //console.log(vendors);
        res.json(vendors);
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

vendorCtlr.pendingList = async (req, res) => {
    try{
        const vendors = await Vendor.find({isApproved: false });
        res.json(vendors);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"});
    }
}

vendorCtlr.update = async (req, res) => {
    try{
        const id =  req.params.id;          
        const body = req.body;
        const {error, value} = vendorValidationSchema.validate(body, {abortEarly: false});  
        if(error){
            return res.status(400).json({error: error.details});            
        }       
        const vendor = await Vendor.findOneAndUpdate({_id: id, userId: req.userId}, value, {new: true});      
        if(!vendor){    
            return  res.status(404).json({message: "Vendor profile not found or you are not authorized to update"});
        }   
        res.json(vendor);
    }  catch(err){  
        console.log(err);          
        res.status(500).json({error: "Something went wrong"});
    }           
}   

vendorCtlr.remove = async (req, res) => {
    try{
        const id = req.params.id;
        const vendor = await Vendor.findOneAndDelete({_id: id, userId: req.userId});
        if(!vendor){
            return res.status(404).json({message: "Vendor not found"})
        }
        res.json({message:"vendor deleted successfully"})
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"})
    }
}

module.exports = vendorCtlr;