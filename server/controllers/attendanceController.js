const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const markAttendance = async (req, res) => {
  try {
    const { students, date, hour, branch, year, section, subjectName } = req.body;

    // Prevent duplicate attendance entry for the same class and hour
    const existing = await Attendance.findOne({
      date: new Date(date),
      hour: Number(hour),
      subjectName,
      branch,
      year,
      section
    });

    if (existing) {
      return res.status(400).json({ message: "Attendance has already been marked for this subject and hour. Re-submission is disabled." });
    }

    let count = 0;

    for (const entry of students) {
      await Attendance.updateOne(
        {
          studentId: entry.studentId,
          date: new Date(date),
          hour,
          subjectName,
        },
        {
          $set: {
            studentId: entry.studentId,
            facultyId: req.user._id,
            date: new Date(date),
            hour,
            status: entry.status,
            branch,
            year,
            section,
            subjectName,
          },
        },
        { upsert: true }
      );
      count++;
    }

    res.json({ message: 'Attendance marked successfully', count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { branch, year, section, subjectName, date, hour } = req.query;

    const filter = {};
    if (branch) filter.branch = branch;
    if (year) filter.year = Number(year);
    if (section) filter.section = section;
    if (subjectName) filter.subjectName = subjectName;
    if (hour) filter.hour = Number(hour);
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await Attendance.find(filter).populate('studentId', 'rollNumber name');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const filter = { studentId };
    if (req.query.subjectName) filter.subjectName = req.query.subjectName;
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.section) filter.section = req.query.section;

    const attendance = await Attendance.find(filter).populate('studentId', 'rollNumber name');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const attendance = await Attendance.find({ studentId: student._id }).populate(
      'studentId',
      'rollNumber name'
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyPercentage = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const totalRecords = await Attendance.countDocuments({ studentId: student._id });
    const presentRecords = await Attendance.countDocuments({
      studentId: student._id,
      status: 'present',
    });
    const absentRecords = totalRecords - presentRecords;

    const percentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    let status;
    if (percentage < 65) {
      status = 'Red Alert: You will be detained soon';
    } else if (percentage < 75) {
      status = 'You will be condonated soon';
    } else if (percentage < 80) {
      status = 'Good';
    } else {
      status = 'Excellent Attendance';
    }

    res.json({
      percentage: Math.round(percentage * 100) / 100,
      status,
      totalHours: totalRecords,
      presentHours: presentRecords,
      absentHours: absentRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBunkersList = async (req, res) => {
  try {
    const { branch, date } = req.query;
    if (!branch || !date) {
      return res.status(400).json({ message: 'Branch and date are required.' });
    }

    // Build day range
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all attendance records for this branch on this date
    const dayRecords = await Attendance.find({
      branch,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate('studentId', 'rollNumber name year section');

    // Group records by student
    const studentMap = {};
    for (const rec of dayRecords) {
      if (!rec.studentId) continue;
      const sid = rec.studentId._id.toString();
      if (!studentMap[sid]) {
        studentMap[sid] = {
          student: rec.studentId,
          hours: [],
        };
      }
      studentMap[sid].hours.push({ hour: rec.hour, status: rec.status });
    }

    // Identify bunkers: must have at least one present AND one absent, with present before absent
    const bunkerStudentIds = [];
    const bunkerDetails = {};

    for (const [sid, data] of Object.entries(studentMap)) {
      const sorted = data.hours.sort((a, b) => a.hour - b.hour);
      const hasPresent = sorted.some(h => h.status === 'present');
      const hasAbsent = sorted.some(h => h.status === 'absent');
      if (!hasPresent || !hasAbsent) continue;

      // Find first present hour
      const firstPresentHour = sorted.find(h => h.status === 'present')?.hour;
      // Collect absent hours that come after first present hour
      const bunkedHours = sorted
        .filter(h => h.status === 'absent' && h.hour > firstPresentHour)
        .map(h => `Hour ${h.hour}`);

      if (bunkedHours.length > 0) {
        bunkerStudentIds.push(data.student._id);
        bunkerDetails[sid] = {
          student: data.student,
          bunkedHoursToday: bunkedHours,
        };
      }
    }

    if (bunkerStudentIds.length === 0) {
      return res.json([]);
    }

    // Calculate total historical bunks for each bunker student
    // A historical bunk = an absent record for a student on a date where they also have at least one present
    const allHistoricalRecords = await Attendance.find({
      studentId: { $in: bunkerStudentIds },
    });

    // Group by studentId + date
    const historicalMap = {};
    for (const rec of allHistoricalRecords) {
      const sid = rec.studentId.toString();
      const dayKey = rec.date.toISOString().split('T')[0];
      if (!historicalMap[sid]) historicalMap[sid] = {};
      if (!historicalMap[sid][dayKey]) historicalMap[sid][dayKey] = { hasPresent: false, absentCount: 0 };
      if (rec.status === 'present') historicalMap[sid][dayKey].hasPresent = true;
      if (rec.status === 'absent') historicalMap[sid][dayKey].absentCount++;
    }

    // Sum total bunked hours across all days (only days with at least one present)
    const totalBunksMap = {};
    for (const [sid, days] of Object.entries(historicalMap)) {
      let total = 0;
      for (const dayData of Object.values(days)) {
        if (dayData.hasPresent) total += dayData.absentCount;
      }
      totalBunksMap[sid] = total;
    }

    // Build final result
    const result = Object.entries(bunkerDetails).map(([sid, data]) => ({
      studentId: sid,
      rollNumber: data.student.rollNumber,
      name: data.student.name,
      year: data.student.year,
      section: data.student.section,
      bunkedHoursToday: data.bunkedHoursToday,
      totalBunks: totalBunksMap[sid] || 0,
    }));

    // Sort by year asc, then rollNumber in Ascending Order
    result.sort((a, b) => a.year - b.year || a.rollNumber.localeCompare(b.rollNumber));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  getMyAttendance,
  getMyPercentage,
  getBunkersList,
};
