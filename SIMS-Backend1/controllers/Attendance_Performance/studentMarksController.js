const StudentMarks = require('../../models/Attendance_PerformanceSchema/StudentMarks');

exports.addMarks = async (req, res) => {
  try {
    const marks = await StudentMarks.create(req.body);
    res.status(201).json(marks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await StudentMarks.find({ student_id: req.params.studentId })
      .populate('exam_id subject_id');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
