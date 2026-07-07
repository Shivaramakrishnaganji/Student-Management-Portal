const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, 'Subject name is required'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
    },
  },
  { timestamps: true }
);

subjectSchema.index({ subjectName: 1, branch: 1, year: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
