const Subject = require('../models/Subject');

const createSubject = async (req, res) => {
  try {
    const { subjectName, branch, year, section } = req.body;

    const subject = await Subject.create({ subjectName, branch, year, section });
    res.status(201).json(subject);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject already exists for this branch, year, and section' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.section) filter.section = req.query.section;

    const subjects = await Subject.find(filter);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createSubject, getAllSubjects };
