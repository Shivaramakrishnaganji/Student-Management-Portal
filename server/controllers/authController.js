const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Please provide user id and password/code' });
    }

    const user = await User.findOne({ loginId: loginId.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user id or code' });
    }

    let isMatch = false;

    if (user.role === 'admin' || user.role === 'faculty') {
      // Verify TOTP code for admin and faculty
      isMatch = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: password,
        window: 1 // Allow 1 step before/after to handle slight time sync issues
      });
    } else {
      // Verify static bcrypt password for students
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials or code' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        loginId: user.loginId,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login, getMe };
