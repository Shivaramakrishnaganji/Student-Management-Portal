const Joi = require('joi');

const createFacultySchema = Joi.object({
  name: Joi.string().required(),
  loginId: Joi.string().required(),
  branch: Joi.string().required(),
});

const facultyAllocationSchema = Joi.object({
  facultyId: Joi.string().required(), // loginId of faculty
  facultyName: Joi.string().required(),
  branch: Joi.string().required(),
  year: Joi.number().min(1).max(4).required(),
  section: Joi.string().required(),
  subjectName: Joi.string().required(),
});

module.exports = { createFacultySchema, facultyAllocationSchema };
