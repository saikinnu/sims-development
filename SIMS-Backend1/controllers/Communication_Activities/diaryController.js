const HomeworkDiary = require('../../models/Communication_Activities/HomeworkDiary');
const PersonalDiary = require('../../models/Communication_Activities/PersonalDiary');

// --- Homework Diary ---
exports.getHomework = async (req, res) => {
  try {
    const { teacherId } = req.query;
    const filter = teacherId ? { teacherId } : {};
    const entries = await HomeworkDiary.find(filter).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createHomework = async (req, res) => {
  try {
    const entry = await HomeworkDiary.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateHomework = async (req, res) => {
  try {
    const updated = await HomeworkDiary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteHomework = async (req, res) => {
  try {
    const deleted = await HomeworkDiary.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Personal Diary ---
exports.getPersonal = async (req, res) => {
  try {
    const { teacherId } = req.query;
    const filter = teacherId ? { teacherId } : {};
    const notes = await PersonalDiary.find(filter).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPersonal = async (req, res) => {
  try {
    const note = await PersonalDiary.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePersonal = async (req, res) => {
  try {
    const updated = await PersonalDiary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePersonal = async (req, res) => {
  try {
    const deleted = await PersonalDiary.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};