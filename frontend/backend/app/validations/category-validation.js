const Joi = require("joi");
const categoryValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    imageUrl: Joi.string()
})

module.exports = categoryValidationSchema;