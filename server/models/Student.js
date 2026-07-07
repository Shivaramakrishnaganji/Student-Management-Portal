const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
