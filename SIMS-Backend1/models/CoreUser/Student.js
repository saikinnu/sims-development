const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    user_id: {
      // type: mongoose.Schema.Types.ObjectId,
      type:String,
      // ref: "User",
      // required: true,
      unique: true,
    },
    password:{
      type:String
    },
    role:{
      type:String
    },
    full_name: {
      type: String,
      // required: true,
    },
    email:{
      type:String
    },
    admission_number: {
      type: String,
      // required: true,
      unique: true,
    },
    date_of_birth: {
      type: Date,
      // required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      // required: true,
    },
    address: {
      type: String,
      // required: true,
    },
    parent_id: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        type:String,
        // ref: "Parent",
      }
    ],
    class_id: {
      // type: mongoose.Schema.Types.ObjectId,
      type:String
      // ref: "Class", // FK to Classes.class_id
      // required: true,
    },
    blood_group: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
        "Unknown",
      ],
      default: "Unknown",
    },
    medical_notes: {
      type: String,
    },
    profile_image: {
      public_id: { type: String },
      url: { type: String },
    },
    contact: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
    },
    student_type: {
      type: String,
      enum: ["Current Student", "Migrated Student"],
      default: "Current Student",
    },
    previous_school_name: {
      type: String,
    },
    previous_school_address: {
      type: String,
    },
    previous_school_phone_number: {
      type: String,
    },
    previous_school_start_date: {
      type: Date,
    },
    previous_school_end_date: {
      type: Date,
    },
    documents: [
      {
        url: { type: String },
        name: { type: String },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
