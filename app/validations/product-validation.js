const Joi = require("joi");
const productValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().allow(""),    
    price: Joi.number().positive().required(),
    imageUrl: Joi.string().uri().allow(""),
    stock: Joi.number().integer().min(0),
    categoryId: Joi.string().hex().length(24).required(),
}); 
module.exports = productValidationSchema;   