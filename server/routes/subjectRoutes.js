const express = require('express');
const router = express.Router();
const { createSubject, getAllSubjects } = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { subjectSchema } = require('../validations/subjectValidation');

router.post('/', protect, authorize('admin'), validate(subjectSchema), createSubject);
router.get('/', protect, getAllSubjects);

module.exports = router;
