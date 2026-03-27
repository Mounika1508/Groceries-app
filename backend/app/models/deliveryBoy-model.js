const mongoose = require("mongoose");
const deliveryBoySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    isAvailable: { type: Boolean, default: false },
    vehicleNumber: { type: String, required: true }
}, { timestamps: true }
);  

const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);
module.exports = DeliveryBoy;