const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Faculty ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    hour: {
      type: Number,
      required: [true, 'Hour is required'],
      min: 1,
      max: 8,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: [true, 'Status is required'],
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

attendanceSchema.index(
  { studentId: 1, date: 1, hour: 1, subjectName: 1 },
  { unique: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
