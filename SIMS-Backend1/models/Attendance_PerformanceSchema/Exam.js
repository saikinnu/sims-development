const mongoose = require("mongoose");

const { Schema } = mongoose;

const ExamSchema = new Schema(
  {
    exam_id: {
      type: String,
      required: true,
      unique: true,
    },
    exam_name: {
      type: String,
      required: true,
      enum: ["Mid-Term", "Final", "Unit Test", "Quarterly", "Half-Yearly", "Annual"],
    },
    academic_year: {
      type: String,
      required: true, // e.g., "2024-2025"
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    syllabus_file: {
      type: String, // Cloudinary URL
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "exams",
  }
);

module.exports = mongoose.model("Exam", ExamSchema);
