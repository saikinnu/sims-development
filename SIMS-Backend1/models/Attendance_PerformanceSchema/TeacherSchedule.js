const mongoose = require('mongoose');

const TeacherScheduleSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  dayOfWeek: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  classId: { type: String, required: true }
});

module.exports = mongoose.model('TeacherSchedule', TeacherScheduleSchema); 