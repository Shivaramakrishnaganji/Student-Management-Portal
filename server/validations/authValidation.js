const Joi = require('joi');

const loginSchema = Joi.object({
  loginId: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().optional(),
});

module.exports = { loginSchema };
