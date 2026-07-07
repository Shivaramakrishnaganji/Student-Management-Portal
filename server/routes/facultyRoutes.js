const express = require('express');
const router = express.Router();
const { createAllocation, getAllAllocations, updateAllocation, deleteAllocation, createFaculty, getFacultyList } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), createAllocation);
router.post('/create', protect, authorize('admin'), createFaculty);
router.get('/list', protect, authorize('admin'), getFacultyList);
router.get('/', protect, authorize('admin', 'faculty'), getAllAllocations);
router.put('/:id', protect, authorize('admin'), updateAllocation);
router.delete('/:id', protect, authorize('admin'), deleteAllocation);

module.exports = router;
