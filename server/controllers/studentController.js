const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const User = require('../models/User');

const createStudent = async (req, res) => {
  try {
    const { rollNumber, name, branch, year, section } = req.body;

    const existingUser = await User.findOne({ loginId: rollNumber.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rollNumber, salt); // Password defaults to rollno

    const user = await User.create({
      name,
      loginId: rollNumber.toLowerCase(),
      password: hashedPassword,
      role: 'student',
    });

    const student = await Student.create({
      rollNumber,
      name,
      branch,
      year,
      section,
      userId: user._id,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.section) filter.section = req.query.section;

    const students = await Student.find(filter).populate('userId', 'name loginId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId', 'name loginId');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { rollNumber, name, branch, year, section, password } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (rollNumber) student.rollNumber = rollNumber;
    if (name) student.name = name;
    if (branch) student.branch = branch;
    if (year) student.year = year;
    if (section) student.section = section;

    await student.save();

    if (password) {
      const user = await User.findById(student.userId);
      if (user) {
        if (name) user.name = name;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
      }
    }

    const updatedStudent = await Student.findById(req.params.id).populate('userId', 'name loginId');
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
