const Joi = require('joi');

const markAttendanceSchema = Joi.object({
  students: Joi.array().items(
    Joi.object({
      studentId: Joi.string().required(),
      status: Joi.string().valid('present', 'absent').required(),
    })
  ).required(),
  date: Joi.date().required(),
  hour: Joi.number().min(1).max(8).required(),
  branch: Joi.string().required(),
  year: Joi.number().min(1).max(4).required(),
  section: Joi.string().required(),
  subjectName: Joi.string().required(),
});

module.exports = { markAttendanceSchema };
