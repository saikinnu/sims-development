const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeacherSchema = new Schema({
  user_id: {
    type: String,
    // ref: 'User',
    // required: true,
    unique: true,
  },
  full_name: {
    type: String,
    // required: true,
  },
  email:{
    type:String
  },
  password:{
    type:String,
    // required:true
  },
  role:{
    type:String
  },
  phone: {
    type: String,
    // required: true,
    match: /^[6-9]\d{9}$/, // Indian phone number validation
  },
  address:{
    type: String
  },
  qualification: {
    type: String,
    // required: true,
  },
  subjects_taught: [
    {
      type: String // or use ref if you have a Subject model
      // type: mongoose.Schema.Types.ObjectId, ref: 'Subject'
    }
  ],
  assigned_classes:[
    {
      type: String
    }
  ],
  class_teacher:{
    type:String
  },
  profile_image: {
    public_id: String,
    url: String,
  },
  // certificates: [
  //   {
  //     public_id: String,
  //     url: String,
  //   }
  // ],
  joining_date: {
    type: Date,
    default: Date.now,
  },
  salary_details: {
    type: Schema.Types.ObjectId,
    ref: 'Payroll', // optional reference to a Payroll schema
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
