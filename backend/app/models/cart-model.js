const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true},   
    vendorId: {type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true}, 
    items: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: Number,
        itemTotal: Number
    }],
    subtotal: {type: Number, default: 0},
}, {timestamps: true});
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;