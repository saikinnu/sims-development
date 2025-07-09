const mongoose = require("mongoose");

const TransportAllocationSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  pickup_stop: {
    type: String,
    required: true
  },
  drop_stop: {
    type: String,
    required: true
  },
  annual_fee: {
    type: Number,
    default: 0
  },
  academic_year: {
    type: String,
    required: true
  },
  document_url: {
    type: String // optional, stores Cloudinary uploaded file (e.g. bus pass, route map)
  }
}, { timestamps: true });

module.exports = mongoose.model("TransportAllocation", TransportAllocationSchema);
