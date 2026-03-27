const Vendor = require("../models/vendor-model");
const Order = require("../models/order-model");
const deliveryBoyValidationSchema = require("../validations/deliveryBoy-validation");
const DeliveryBoy = require("../models/deliveryBoy-model");
const deliveryBoyCtlr = {};

//creating profile
deliveryBoyCtlr.create = async (req, res) => {
    try{
        const body = req.body;
        const userId = req.userId;
        if(req.role !== 'deliveryboy'){
            return res.status(403).json({error: "Only delivery boys can create delivery boy profiles"});
        }   
        const {error, value} = deliveryBoyValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }   
        const existingDeliveryBoy = await DeliveryBoy.findOne({userId});
        if(existingDeliveryBoy){
            return res.status(400).json({error: "Delivery boy profile already exists for this user"});
        }
        const deliveryBoy = await DeliveryBoy.create({        
            userId, 
            phone: value.phone,     
            address: value.address,
            city: value.city,
            vehicleNumber: value.vehicleNumber
        });
        const populatedDeliveryBoy = await DeliveryBoy.findById(deliveryBoy._id).populate('userId', '_id username email');
        res.status(201).json(populatedDeliveryBoy); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}      

deliveryBoyCtlr.listAvailable = async (req, res) => {
    try{
        const deliveryBoys = await DeliveryBoy.find({isAvailable: true}).populate("userId", "username ").select("userId phone isAvailable");
        res.json(deliveryBoys);     
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

deliveryBoyCtlr.account = async (req, res) => {
    try{
        const deliveryBoy = await DeliveryBoy.findOne({userId: req.userId}).populate("userId", "username email");
        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery boy profile not found" });
       }
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
        const orders = await Order.find({deliveryBoyId: deliveryBoy._id, status: {$in: ["on-the-way", "delivered"]}}).sort({createdAt: -1}).populate('customerId', 'username address city phone')
        .populate('products.productId', 'name image price').populate('deliveryBoyId', 'name phone')  
        res.json(orders);
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

deliveryBoyCtlr.update = async (req, res) => {
    try {
        const { error, value } = deliveryBoyValidationSchema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({ error: error.details });
        }

        const deliveryBoy = await DeliveryBoy.findOneAndUpdate(
            { userId: req.userId },
            {
                phone: value.phone,
                address: value.address,
                city: value.city,
                vehicleNumber: value.vehicleNumber
            },
            { new: true }
        );

        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery boy profile not found" });
        }

        const result = await DeliveryBoy.findById(deliveryBoy._id)
            .populate("userId", "username email");

        res.json(result);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

deliveryBoyCtlr.toggleAvailability = async (req, res) => {
  const boy = await DeliveryBoy.findOne({ userId: req.userId });
  boy.isAvailable = req.body.isAvailable;
  await boy.save();
  res.json({ isAvailable: boy.isAvailable });
};

deliveryBoyCtlr.remove = async (req, res) => {
    try {
        const removed = await DeliveryBoy.findOneAndDelete({ userId: req.userId });

        if (!removed) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ message: "Profile deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = deliveryBoyCtlr;