const Joi = require('joi');
const userRegisterSchema = Joi.object({
    username: Joi.string().trim().required().min(4).max(64),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required().min(8).max(128),
    role: Joi.string().required() 
})

const userLoginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required().min(8).max(128)
})

module.exports = {
    userRegisterSchema,
    userLoginSchema
};