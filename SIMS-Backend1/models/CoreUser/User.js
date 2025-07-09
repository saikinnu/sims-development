const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const UserSchema = new Schema({
  user_id: {
    type: String,
    // default: uuidv4,
    unique: true,
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["superadmin", "admin", "teacher", "student", "parent"],
    required: true,
    default: 'student'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Password comparison
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
