const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentAttendanceSchema = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true,
  },
  remarks: {
    type: String,
  },
  proofImage: {
    type: String, // Cloudinary URL
  },
}, { timestamps: true });

module.exports = mongoose.model('StudentAttendance', StudentAttendanceSchema);
