// models/BankDetails.js
const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountNumber:{type:String,required:true},
  ifscCode: { type: String, required: true },
  upiId:{type:String},
  qrFileName: {
    type:String
  },
}, { timestamps: true });

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
