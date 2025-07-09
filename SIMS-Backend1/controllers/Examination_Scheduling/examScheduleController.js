const ExamSchedule = require('../../models/Examination_Scheduling/ExamSchedule');

exports.createSchedule = async (req, res) => {
  try {
    const schedule = await ExamSchedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getClassSchedule = async (req, res) => {
  try {
    const schedule = await ExamSchedule.find({ class_id: req.params.classId })
      .populate('exam_id subject_id');
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
