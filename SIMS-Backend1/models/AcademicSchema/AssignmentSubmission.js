const mongoose = require('mongoose');

const AssignmentSubmissionSchema = new mongoose.Schema({
    assignment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
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
    file: {
        public_id: String,
        url: String,
    },
    remarks: {
        type: String,
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'B', 'C', 'D', 'F', 'Incomplete'],
    },
}, { timestamps: true });

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
