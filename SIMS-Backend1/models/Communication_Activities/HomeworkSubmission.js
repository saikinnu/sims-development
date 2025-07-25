const mongoose = require('mongoose');

const HomeworkSubmissionSchema = new mongoose.Schema({
  assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HomeworkAssignment',
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  file_url: {
    type: String, // Cloudinary file URL
    required: true,
  },
  feedback: {
    type: String,
  },
  grade: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('HomeworkSubmission', HomeworkSubmissionSchema);
