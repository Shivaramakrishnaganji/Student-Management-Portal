const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const speakeasy = require('speakeasy');

dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');
const Subject = require('./models/Subject');
const FacultyAllocation = require('./models/FacultyAllocation');
const Attendance = require('./models/Attendance');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Drop database to clear old indexes
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped.');

    // Clear all collections (redundant now but fine to keep)
    await User.deleteMany({});
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await FacultyAllocation.deleteMany({});
    await Attendance.deleteMany({});
    console.log('All collections cleared.');

    const salt = await bcrypt.genSalt(10);

    // Create Admin
    const adminSecret = speakeasy.generateSecret({ name: 'StudentPortal (Admin)' });
    const admin = await User.create({
      name: 'Admin',
      loginId: 'admin',
      role: 'admin',
      totpSecret: adminSecret.base32,
    });
    console.log('Admin user created.');

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
    console.log('Faculty users created.');

    // Create Student Users and Student Records
    const raviPassword = await bcrypt.hash('235801', salt);
    const raviUser = await User.create({
      name: 'Ravi Kumar',
      loginId: '235801',
      password: raviPassword,
      role: 'student',
    });
    const ravi = await Student.create({
      rollNumber: '235801',
      name: 'Ravi Kumar',
      branch: 'CSE',
      year: 2,
      section: 'A',
      userId: raviUser._id,
    });

    const priyaPassword = await bcrypt.hash('235802', salt);
    const priyaUser = await User.create({
      name: 'Priya Sharma',
      loginId: '235802',
      password: priyaPassword,
      role: 'student',
    });
    const priya = await Student.create({
      rollNumber: '235802',
      name: 'Priya Sharma',
      branch: 'CSE',
      year: 2,
      section: 'A',
      userId: priyaUser._id,
    });

    const arjunPassword = await bcrypt.hash('235803', salt);
    const arjunUser = await User.create({
      name: 'Arjun Reddy',
      loginId: '235803',
      password: arjunPassword,
      role: 'student',
    });
    const arjun = await Student.create({
      rollNumber: '235803',
      name: 'Arjun Reddy',
      branch: 'ECE',
      year: 3,
      section: 'B',
      userId: arjunUser._id,
    });

    const snehaPassword = await bcrypt.hash('235804', salt);
    const snehaUser = await User.create({
      name: 'Sneha Patel',
      loginId: '235804',
      password: snehaPassword,
      role: 'student',
    });
    const sneha = await Student.create({
      rollNumber: '235804',
      name: 'Sneha Patel',
      branch: 'ECE',
      year: 3,
      section: 'B',
      userId: snehaUser._id,
    });
    console.log('Student users and records created.');

    // Create Subjects
    const ds = await Subject.create({
      subjectName: 'Data Structures',
      branch: 'CSE',
      year: 2,
      section: 'A',
    });

    const dbms = await Subject.create({
      subjectName: 'Database Systems',
      branch: 'CSE',
      year: 2,
      section: 'A',
    });

    const sp = await Subject.create({
      subjectName: 'Signal Processing',
      branch: 'ECE',
      year: 3,
      section: 'B',
    });
    console.log('Subjects created.');

    // Create Faculty Allocations
    await FacultyAllocation.create({
      facultyId: vishnu._id,
      facultyName: 'Prof. Vishnu',
      branch: 'CSE',
      year: 2,
      section: 'A',
      subjectName: 'Data Structures',
    });

    await FacultyAllocation.create({
      facultyId: vishnu._id,
      facultyName: 'Prof. Vishnu',
      branch: 'CSE',
      year: 2,
      section: 'A',
      subjectName: 'Database Systems',
    });

    await FacultyAllocation.create({
      facultyId: lakshmi._id,
      facultyName: 'Prof. Lakshmi',
      branch: 'ECE',
      year: 3,
      section: 'B',
      subjectName: 'Signal Processing',
    });
    console.log('Faculty allocations created.');

    // Create Sample Attendance Records
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const attendanceRecords = [];

    // Ravi: mostly present (7 out of 8)
    // Today hours 1-4
    attendanceRecords.push(
      { studentId: ravi._id, facultyId: vishnu._id, date: today, hour: 1, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: today, hour: 2, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: today, hour: 3, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: today, hour: 4, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' }
    );
    // Yesterday hours 1-4
    attendanceRecords.push(
      { studentId: ravi._id, facultyId: vishnu._id, date: yesterday, hour: 1, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: yesterday, hour: 2, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: yesterday, hour: 3, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: ravi._id, facultyId: vishnu._id, date: yesterday, hour: 4, status: 'absent', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' }
    );

    // Priya: mixed (5 out of 8)
    // Today hours 1-4
    attendanceRecords.push(
      { studentId: priya._id, facultyId: vishnu._id, date: today, hour: 1, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: today, hour: 2, status: 'absent', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: today, hour: 3, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: today, hour: 4, status: 'absent', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' }
    );
    // Yesterday hours 1-4
    attendanceRecords.push(
      { studentId: priya._id, facultyId: vishnu._id, date: yesterday, hour: 1, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: yesterday, hour: 2, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: yesterday, hour: 3, status: 'absent', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' },
      { studentId: priya._id, facultyId: vishnu._id, date: yesterday, hour: 4, status: 'present', branch: 'CSE', year: 2, section: 'A', subjectName: 'Data Structures' }
    );

    await Attendance.insertMany(attendanceRecords);
    console.log('Sample attendance records created.');

    // Summary
    console.log('\n========== SEED SUMMARY & SETUP ==========');
    console.log(`Admin ID: admin`);
    console.log(`  -> Google Authenticator Secret: ${adminSecret.base32}`);
    console.log(`Faculty ID: 23325 (Vishnu)`);
    console.log(`  -> Google Authenticator Secret: ${vishnuSecret.base32}`);
    console.log(`Faculty ID: 23326 (Lakshmi)`);
    console.log(`  -> Google Authenticator Secret: ${lakshmiSecret.base32}`);
    console.log(`Students: 4 (235801, 235802, 235803, 235804)`);
    console.log(`  -> Passwords are same as rollno (no Authenticator required)`);
    console.log(`Subjects: 3 (Data Structures, Database Systems, Signal Processing)`);
    console.log(`Faculty Allocations: 3`);
    console.log(`Attendance Records: ${attendanceRecords.length}`);
    console.log(`  - Ravi: 7/8 present (87.5%)`);
    console.log(`  - Priya: 5/8 present (62.5%)`);
    console.log('===================================\n');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
