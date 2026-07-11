const express = require('express');
const router = express.Router();
const { createAllocation, getAllAllocations, updateAllocation, deleteAllocation, createFaculty, getFacultyList } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createFacultySchema, facultyAllocationSchema } = require('../validations/facultyValidation');

router.post('/', protect, authorize('admin'), validate(facultyAllocationSchema), createAllocation);
router.post('/create', protect, authorize('admin'), validate(createFacultySchema), createFaculty);
router.get('/list', protect, authorize('admin'), getFacultyList);
router.get('/', protect, authorize('admin', 'faculty'), getAllAllocations);
router.put('/:id', protect, authorize('admin'), validate(facultyAllocationSchema), updateAllocation);
router.delete('/:id', protect, authorize('admin'), deleteAllocation);

module.exports = router;
