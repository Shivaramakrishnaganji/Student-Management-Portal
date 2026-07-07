const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    loginId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    totpSecret: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
      required: [true, 'Role is required'],
    },
    branch: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
