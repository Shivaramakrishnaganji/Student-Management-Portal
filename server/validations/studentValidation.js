const Joi = require('joi');

const studentSchema = Joi.object({
  rollNumber: Joi.string().required(),
  name: Joi.string().required(),
  branch: Joi.string().required(),
  year: Joi.number().min(1).max(4).required(),
  section: Joi.string().required(),
  loginId: Joi.string().required(), // When creating a student, we also create their user account, so we need loginId
});

module.exports = { studentSchema };
