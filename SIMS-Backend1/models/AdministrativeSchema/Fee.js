// models/Fee.js
const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
  amount_due: Number,
  amount_paid: Number,
  payment_date: Date,
  receipt_url: String,
  status: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
});

const FeeSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    due_date: Date,
    first_term: termSchema,
    second_term: termSchema,
    third_term: termSchema,
    overall_status: {
      type: String,
      enum: ["Paid", "Partial", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", FeeSchema);
