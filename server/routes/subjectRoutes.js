const express = require('express');
const router = express.Router();
const { createSubject, getAllSubjects } = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), createSubject);
router.get('/', protect, getAllSubjects);

module.exports = router;
