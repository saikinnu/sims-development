// models/BankDetails.js
const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema({
  bank_name: { type: String, required: true },
  bank_IFSC: { type: String, required: true },
  qr_code: {
    public_id: String,
    url: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
