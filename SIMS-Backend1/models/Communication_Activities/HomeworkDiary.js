const mongoose = require('mongoose');

const HomeworkItemSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  homework: { type: String, required: true },
}, { _id: false });

const HomeworkDiarySchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  homeworkItems: { type: [HomeworkItemSchema], required: true },
}, { timestamps: true });

module.exports = mongoose.model('HomeworkDiary', HomeworkDiarySchema); 