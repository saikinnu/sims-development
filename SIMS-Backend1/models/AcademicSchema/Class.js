const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true,
    unique: true,
  },
  strength: {
    type: Number,
    required: true,
  },
  grade:{
    type: String
  },
  supervisor:{
    type:String
  },
  teachers_details:[
    {
      name: {
        type: String,
        required: true
      },
      empId: {
        type: String,
        required: true
      },
      subjects: [{
        type: String
      }]
    }
  ],
  // academic_year: {
  //   type: String,
  //   required: true,
  // },
  // class_teacher_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Teacher',
  //   required: true,
  // },
  // room_number: {
  //   type: String,
  //   required: true,
  // },
  // subjects: [
  //   {
  //     subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  //     teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  //   },
  // ],
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);