const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { loginSchema } = require('../validations/authValidation');

router.post('/', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
