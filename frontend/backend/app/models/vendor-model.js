const mongoose = require('mongoose');  

const vendorSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
    shopName: {type: String, required: true},
    phone: {type: String, required: true},      
    address: {type: String, required: true},
    city: {type: String, required: true},
    imageUrl: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now},
    isApproved: {type: Boolean, default: false},        
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;