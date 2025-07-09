const mongoose = require('mongoose');

const ExamScheduleSchema = new mongoose.Schema({
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  exam_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  room_number: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ExamSchedule', ExamScheduleSchema);
