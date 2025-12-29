const Joi = require('joi');
const deliveryBoyValidationSchema = Joi.object({
    phone: Joi.string().trim().required().min(10).max(15),
    address: Joi.string().trim().required().min(3).max(256),        
    city: Joi.string().trim().required().min(2).max(64),
    vehicleNumber: Joi.string().trim().required().min(3).max(20)
});  
module.exports = deliveryBoyValidationSchema;   