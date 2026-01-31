const Vendor = require("../models/vendor-model");

const adminCtlr= {};

adminCtlr.approveVendor = async (req, res) => {
    try{
        const vendorId = req.params.vendorId;
        const vendor = await Vendor.findById(vendorId);
        if(!vendor){
            return res.status(404).json({message: "Vendor not found"});
        }   
        if(vendor.isApproved){
            return  res.status(400).json({message: "Vendor is already approved"});
        }   
        vendor.isApproved = true;
        await vendor.save();
        res.json({message: `Vendor approved successfully`});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"})
    }
} 

adminCtlr.rejectVendor = async (req, res) => {
    try{
        const vendorId = req.params.vendorId;   
        const vendor = await Vendor.findByIdAndDelete(vendorId);
        if(!vendor){
            return res.status(404).json({message: "Vendor not found"});
        }
        res.json({message: "Vendor rejected and removed successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"})
    }   
}   

adminCtlr.listPendingVendors = async (req, res) => {
    try{
        const pendingVendors = await Vendor.find({isApproved: false}).populate('userId', 'email');      
        res.json(pendingVendors);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"})
    }       
}   
        


module.exports = adminCtlr;