const FacultyAllocation = require('../models/FacultyAllocation');

const createAllocation = async (req, res) => {
  try {
    const { facultyId, facultyName, branch, year, section, subjectName } = req.body;

    // facultyId here is actually the 5-digit loginId from the frontend
    const User = require('../models/User');
    const user = await User.findOne({ loginId: facultyId, role: 'faculty' });

    if (!user) {
      return res.status(404).json({ message: 'Faculty not found with this ID' });
    }

    const allocation = await FacultyAllocation.create({
      facultyId: user._id, // store the actual ObjectId
      facultyName,
      branch,
      year,
      section,
      subjectName,
    });

    res.status(201).json(allocation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllAllocations = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'faculty') {
      filter.facultyId = req.user._id;
    }

    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.section) filter.section = req.query.section;

    const allocations = await FacultyAllocation.find(filter).populate('facultyId', 'name loginId');
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultyId, facultyName, branch, year, section, subjectName } = req.body;

    const User = require('../models/User');
    const user = await User.findOne({ loginId: facultyId, role: 'faculty' });
    if (!user) return res.status(404).json({ message: 'Faculty not found with this ID' });

    const allocation = await FacultyAllocation.findByIdAndUpdate(
      id,
      { facultyId: user._id, facultyName, branch, year, section, subjectName },
      { new: true }
    );
    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const allocation = await FacultyAllocation.findByIdAndDelete(id);
    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
    res.json({ message: 'Allocation removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');

const createFaculty = async (req, res) => {
  try {
    const { name, loginId, branch } = req.body;

    if (!name || !loginId || !branch) {
      return res.status(400).json({ message: 'Faculty name, ID, and Branch are required' });
    }

    // Check if the provided login ID already exists
    const existing = await User.findOne({ loginId: loginId.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'A user with this Faculty ID already exists' });
    }

    // Generate TOTP Secret
    const secret = speakeasy.generateSecret({
      name: `StudentPortal (${name})`,
    });

    const user = await User.create({
      name,
      loginId,
      role: 'faculty',
      branch,
      totpSecret: secret.base32,
    });

    // Generate QR Code URL
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.status(201).json({
      message: 'Faculty created successfully',
      faculty: {
        id: user._id,
        name: user.name,
        loginId: user.loginId,
      },
      qrCodeUrl,
      totpSecret: secret.base32,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFacultyList = async (req, res) => {
  try {
    const filter = { role: 'faculty' };
    if (req.query.branch) filter.branch = req.query.branch;

    const faculties = await User.find(filter).select('-password -totpSecret');
    const allocations = await FacultyAllocation.find();

    const facultyData = faculties.map(fac => {
      const facAllocations = allocations.filter(a => a.facultyId.toString() === fac._id.toString());
      const subjects = facAllocations.map(a => a.subjectName);
      const uniqueSubjects = [...new Set(subjects)];
      
      return {
        _id: fac._id,
        loginId: fac.loginId,
        name: fac.name,
        branch: fac.branch || 'N/A',
        subjectsAssigned: uniqueSubjects.join(', '),
        totalAssigned: uniqueSubjects.length
      };
    });

    res.json(facultyData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createAllocation, getAllAllocations, updateAllocation, deleteAllocation, createFaculty, getFacultyList };
