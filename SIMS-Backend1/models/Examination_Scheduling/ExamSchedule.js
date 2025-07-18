// const mongoose = require('mongoose');

// const ExamScheduleSchema = new mongoose.Schema({
//   exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
//   class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
//   subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
//   exam_date: { type: Date, required: true },
//   start_time: { type: String, required: true },
//   end_time: { type: String, required: true },
//   room_number: { type: String },
// }, { timestamps: true });

// module.exports = mongoose.model('ExamSchedule', ExamScheduleSchema);
const mongoose = require('mongoose');

const subjectSlotSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,  // Stored as String in format "YYYY-MM-DD" to match frontend
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/ // Validates YYYY-MM-DD format
  },
  time: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  }
});

const examScheduleSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
    enum: Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`) // Class 1 to Class 10
  },
  examType: {
    type: String,
    required: true,
    enum: [
      "Formative Assessment 1", "Formative Assessment 2", "Formative Assessment 3",
      "Summative Assessment 1", "Summative Assessment 2", "Summative Assessment 3"
    ]
  },
  subjectSlots: {
    type: [subjectSlotSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0; // At least one subject slot required
      },
      message: 'At least one subject slot is required.'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
// examScheduleSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);

module.exports = ExamSchedule;
