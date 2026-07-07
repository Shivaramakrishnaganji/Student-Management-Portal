const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  getMyAttendance,
  getMyPercentage,
  getBunkersList,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('faculty'), markAttendance);
router.get('/class', protect, authorize('faculty'), getClassAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/my-attendance', protect, authorize('student'), getMyAttendance);
router.get('/my-percentage', protect, authorize('student'), getMyPercentage);
router.get('/bunkers', protect, authorize('admin'), getBunkersList);

module.exports = router;
