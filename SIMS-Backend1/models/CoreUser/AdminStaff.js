const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminStaffSchema = new Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming Users schema is 'User'
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'],
    },
    department: {
      type: String,
      enum: ['Academics', 'Finance', 'HR', 'Administration', 'IT'],
      required: true,
    },
    permissions: {
      type: [String], // You can also store JSON object if more complex
      enum: ['CREATE_USER', 'DELETE_USER', 'VIEW_REPORTS', 'MANAGE_FEES'],
      default: ['VIEW_REPORTS'],
    },
    profileImage: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminStaff', AdminStaffSchema);
