const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');

const User = require('../models/User');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const FacultyAllocation = require('../models/FacultyAllocation');
const Attendance = require('../models/Attendance');

// GET /api/seed?secret=seed_student_portal
// One-time seed route — remove this route after seeding!
router.get('/', async (req, res) => {
  const { secret } = req.query;

  if (secret !== 'seed_student_portal') {
    return res.status(403).json({ message: 'Forbidden: invalid secret' });
  }

  try {
    // Drop database
    await mongoose.connection.db.dropDatabase();

    const salt = await bcrypt.genSalt(10);

    // Create Admin
    const adminSecret = speakeasy.generateSecret({ name: 'StudentPortal (Admin)' });
    await User.create({
      name: 'Admin',
      loginId: 'admin',
      role: 'admin',
      totpSecret: adminSecret.base32,
    });

    // Create Faculty
    const vishnuSecret = speakeasy.generateSecret({ name: 'StudentPortal (Vishnu)' });
    const vishnu = await User.create({
      name: 'Prof. Vishnu',
      loginId: '23325',
      role: 'faculty',
      branch: 'CSE',
      totpSecret: vishnuSecret.base32,
    });

    const lakshmiSecret = speakeasy.generateSecret({ name: 'StudentPortal (Lakshmi)' });
    const lakshmi = await User.create({
      name: 'Prof. Lakshmi',
      loginId: '23326',
      role: 'faculty',
      branch: 'ECE',
      totpSecret: lakshmiSecret.base32,
    });

    // Create Students
    const raviPassword = await bcrypt.hash('235801', salt);
    const raviUser = await User.create({ name: 'Ravi Kumar', loginId: '235801', password: raviPassword, role: 'student' });
    const ravi = await Student.create({ rollNumber: '235801', name: 'Ravi Kumar', branch: 'CSE', year: 2, section: 'A', userId: raviUser._id });

    const priyaPassword = await bcrypt.hash('235802', salt);
    const priyaUser = await User.create({ name: 'Priya Sharma', loginId: '235802', password: priyaPassword, role: 'student' });
    const priya = await Student.create({ rollNumber: '235802', name: 'Priya Sharma', branch: 'CSE', year: 2, section: 'A', userId: priyaUser._id });

    const arjunPassword = await bcrypt.hash('235803', salt);
    const arjunUser = await User.create({ name: 'Arjun Reddy', loginId: '235803', password: arjunPassword, role: 'student' });
    const arjun = await Student.create({ rollNumber: '235803', name: 'Arjun Reddy', branch: 'ECE', year: 3, section: 'B', userId: arjunUser._id });

    const snehaPassword = await bcrypt.hash('235804', salt);
    const snehaUser = await User.create({ name: 'Sneha Patel', loginId: '235804', password: snehaPassword, role: 'student' });
    const sneha = await Student.create({ rollNumber: '235804', name: 'Sneha Patel', branch: 'ECE', year: 3, section: 'B', userId: snehaUser._id });

    // Create Subjects
    const ds = await Subject.create({ subjectName: 'Data Structures', branch: 'CSE', year: 2, section: 'A' });
    const dbms = await Subject.create({ subjectName: 'Database Systems', branch: 'CSE', year: 2, section: 'A' });
    const sp = await Subject.create({ subjectName: 'Signal Processing', branch: 'ECE', year: 3, section: 'B' });

    // Create Faculty Allocations
    await FacultyAllocation.create({ facultyId: vishnu._id, facultyName: 'Prof. Vishnu', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' });
    await FacultyAllocation.create({ facultyId: vishnu._id, facultyName: 'Prof. Vishnu', branch: 'CSE', year: 2, section: 'A', subjectName: 'Database Systems' });
    await FacultyAllocation.create({ facultyId: lakshmi._id, facultyName: 'Prof. Lakshmi', branch: 'ECE', year: 3, section: 'B', subjectName: 'Signal Processing' });

    // Sample Attendance
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    await Attendance.insertMany([
      { studentId: ravi._id, facultyId: vishnu._id, date: today, hour: 1, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: today, hour: 2, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: yesterday, hour: 1, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: yesterday, hour: 2, status: 'absent', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: today, hour: 1, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: today, hour: 2, status: 'absent', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
    ]);

    return res.json({
      message: '✅ Database seeded successfully!',
      credentials: {
        admin: { loginId: 'admin', note: 'Uses Google Authenticator — TOTP secret below', totpSecret: adminSecret.base32 },
        faculty_vishnu: { loginId: '23325', note: 'Uses Google Authenticator', totpSecret: vishnuSecret.base32 },
        faculty_lakshmi: { loginId: '23326', note: 'Uses Google Authenticator', totpSecret: lakshmiSecret.base32 },
        students: [
          { loginId: '235801', password: '235801' },
          { loginId: '235802', password: '235802' },
          { loginId: '235803', password: '235803' },
          { loginId: '235804', password: '235804' },
        ]
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

module.exports = router;
