const Joi = require("joi");
const productValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().allow(""),    
    price: Joi.number().positive().required(),
    quantity: Joi.string().min(0),
    image: Joi.string(),
    publicId: Joi.string(),
    stock: Joi.number().integer().min(0),
    categoryId: Joi.string().hex().length(24).required(),
}); 
module.exports = productValidationSchema;   