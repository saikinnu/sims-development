const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100
    },
    passingMarks: {
      type: Number,
      required: true,
      default: 35
    },
    teachers: [
      {
        name: {
          type: String,
          required: true
        },
        empId: {
          type: String,
          required: true
        }
      }
    ],
    // subject_code: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   uppercase: true,
    // },
    // description: {
    //   type: String,
    //   trim: true,
    // },
    // image: {
    //   public_id: {
    //     type: String,
    //   },
    //   url: {
    //     type: String,
    //   },
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", SubjectSchema);
