const DeliveryBoy = require("../models/deliveryBoy-model");
const Vendor = require("../models/vendor-model");
const Order = require("../models/order-model");
const deliveryBoyValidationSchema = require("../validations/deliveryBoy-validation");
const deliveryBoyCtlr = {};

//creating profile
deliveryBoyCtlr.create = async (req, res) => {
    try{
        const body = req.body;
        const userId = req.userId;
        if(req.role !== 'deliveryboy'){
            return res.status(403).json({message: "Only delivery boys can create delivery boy profiles"});
        }   
        const {error, value} = deliveryBoyValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }   
        const existingDeliveryBoy = await DeliveryBoy.findOne({userId});
        if(existingDeliveryBoy){
            return res.status(400).json({message: "Delivery boy profile already exists for this user"});
        }
        const deliveryBoy = await DeliveryBoy.create({        
            userId, 
            phone: value.phone,     
            address: value.address,
            city: value.city,
            vehicleNumber: value.vehicleNumber
        });
        const populatedDeliveryBoy = await DeliveryBoy.findById(deliveryBoy._id).populate('userId', '_id username ');
        res.status(201).json(populatedDeliveryBoy); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}      

//
// deliveryBoyCtlr.assignVendor = async (req, res) => {
//     try{
//         const deliveryBoyId = req.params.id;
//         const vendor = await Vendor.findOne({userId: req.userId});
//         if(!vendor){
//             return res.status(404).json({message: "Vendor profile not found"});
//         }       

//         const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
//         if(!deliveryBoy){
//             return res.status(404).json({message: "Delivery boy not found"});
//         }   
//         if(deliveryBoy.vendorId){
//             return res.status(400).json({message: "Delivery boy is already assigned to a vendor"});
//         }   
//         deliveryBoy.vendorId = vendor._id;
//         await deliveryBoy.save();
//         res.json(deliveryBoy);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: err.message});
//     }
// }       

// deliveryBoyCtlr.list = async (req, res) => {
//     try{
//         const userId = req.userId;
//         if(req.role !== 'vendor'){
//             return res.status(403).json({message: "Only vendors can view their delivery boys"});
//         }
//         const vendor = await Vendor.findOne({userId});  
//         if(!vendor){
//             return res.status(404).json({message: "Vendor profile not found"});
//         }   
//         const deliveryBoys = await DeliveryBoy.find({vendorId: vendor._id}).populate('userId', '_id username ');
//         res.json(deliveryBoys);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: "Something went wrong"});
//     }   
// }
    

// deliveryBoyCtlr.list = async (req, res) => {
//     try{
//         const vendorId = req.userId;
//         const deliveryBoy = await DeliveryBoy.find({vendorId});
//         // console.log(deliveryBoy);
//         res.json(deliveryBoy);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: "Something went wrong"});
//     }
// }

deliveryBoyCtlr.listavailable = async (req, res) => {
    try{
        const deliveryBoys = await DeliveryBoy.find({isAvailable: true}).select("name phone isAvailable ");
        res.json(deliveryBoys);     
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

deliveryBoyCtlr.account = async (req, res) => {
    try{
        const deliveryBoy = await DeliveryBoy.findById(req.userId);
        res.json(deliveryBoy);
    }catch(err){
        console.log(err)
        return res.status(500).json({error: err.message})
    }
}

deliveryBoyCtlr.myOrders = async (req, res) => {
    try{
        const deliveryBoy = await DeliveryBoy.findOne({userId: req.userId});
        if(!deliveryBoy){
            return res.status(404).json({message: "Delivery boy profile not found"});
        }   
        const orders = await Order.find({deliveryBoyId: deliveryBoy._id, status: "on-the-way"}).populate('customerId', 'username address city phone').populate('vendorId', 'shopName address city phone').populate('deliveryBoyId', 'name phone');  
        res.json(orders);
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}



deliveryBoyCtlr.remove = async(req, res) => {
    try{
        const id = req.params.id;
        const deliveryBoy = await DeliveryBoy.findOneAndDelete({
            _id: id,
            vendorId: req.userId
        })
        if(!deliveryBoy){
            return res.status(403).json({message: "You cannot delete this delivery boy. This does not belong to your vendor account."})
        }
        res.json({message: "Delivery Boy deleted successfully"})
    }catch(err){
        res.status(500).json({error: "Something went wrong"})
    }
}

module.exports = deliveryBoyCtlr;