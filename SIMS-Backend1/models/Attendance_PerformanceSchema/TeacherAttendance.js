// models/TeacherAttendance.js

const mongoose = require('mongoose');

const TeacherAttendanceSchema = new mongoose.Schema({
  attendance_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    required: true,
  },
  supportingDocument: {
    type: String, // Cloudinary URL
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('TeacherAttendance', TeacherAttendanceSchema);
