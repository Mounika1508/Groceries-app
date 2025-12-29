const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },  
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["placed", "packing", "on-the-way", "delivered", "cancelled"], default: "placed" },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryBoy", default: null }
}, {timestamps: true}); 
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;