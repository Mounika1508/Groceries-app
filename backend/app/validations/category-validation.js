const Joi = require("joi");
const categoryValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    image: Joi.string(),
    publicId: Joi.string()
})

module.exports = categoryValidationSchema;