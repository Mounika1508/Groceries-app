const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true},   
    vendorId: {type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true}, 
    items: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        name: {type: mongoose.Schema.Types.String, ref: 'Product'},
        image: {type: mongoose.Schema.Types.String, ref: 'Product'},
        quantity: {type: Number, required: true, min: 1},
        price: {type: Number, required: true, min: 0}
    }]
}, {timestamps: true});
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;