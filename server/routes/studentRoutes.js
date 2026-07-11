const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { studentSchema } = require('../validations/studentValidation');

router.post('/', protect, authorize('admin'), validate(studentSchema), createStudent);
router.get('/', protect, authorize('admin', 'faculty'), getAllStudents);
router.get('/:id', protect, getStudentById);
// For update, we can either create a partial schema or reuse studentSchema if all fields are required
// We will reuse studentSchema for simplicity, assuming full updates
router.put('/:id', protect, authorize('admin'), validate(studentSchema), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;
