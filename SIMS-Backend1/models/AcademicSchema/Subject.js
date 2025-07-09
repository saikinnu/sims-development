const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    subject_name: {
      type: String,
      required: true,
      trim: true,
    },
    subject_code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", SubjectSchema);
