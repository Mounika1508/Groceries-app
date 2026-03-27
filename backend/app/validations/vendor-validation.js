const Joi = require('joi');

const vendorValidationSchema = Joi.object({
    shopName: Joi.string().trim().required().min(3).max(100),
    phone: Joi.string().trim().required().min(10).max(15),      
    address: Joi.string().trim().required().min(3).max(256),
    city: Joi.string().trim().required().min(2).max(64),
    // image: Joi.string().optional(),
    // publicId: Joi.string().optional()
});  
module.exports = vendorValidationSchema;    