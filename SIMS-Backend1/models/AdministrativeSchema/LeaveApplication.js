const mongoose = require("mongoose");

const LeaveApplicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leave_type: {
      type: String,
      enum: ["Sick", "Casual"],
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
      required: true,
    },
    document_url: {
      type: String, // Cloudinary public URL
    },
    document_id: {
      type: String, // Cloudinary public_id (for deletion if needed)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveApplication", LeaveApplicationSchema);
