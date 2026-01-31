const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true},
        city: {type: String, required: true},
}, {timestamps: true
    
});
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;