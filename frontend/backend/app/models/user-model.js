const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, unique: true},
    password:{type: String, required:true},
    role: { type: String, 
            enum: ["customer", "vendor", "admin", "deliveryboy"],
            required: true }  
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;