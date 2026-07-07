const mongoose = require('mongoose');

const facultyAllocationSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Faculty ID is required'],
    },
    facultyName: {
      type: String,
      required: [true, 'Faculty name is required'],
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
    subjectName: {
      type: String,
      required: [true, 'Subject name is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FacultyAllocation', facultyAllocationSchema);
