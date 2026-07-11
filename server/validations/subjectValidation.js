const Joi = require('joi');

const subjectSchema = Joi.object({
  subjectName: Joi.string().required(),
  branch: Joi.string().required(),
  year: Joi.number().min(1).max(4).required(),
  section: Joi.string().required(),
});

module.exports = { subjectSchema };
