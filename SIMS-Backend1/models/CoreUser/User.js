const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");
const { validatePasswordStrength } = require("../../utils/passwordUtils");

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

// Pre-save middleware to hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Validate password strength using utility function
  const validation = validatePasswordStrength(this.password);
  if (!validation.isValid) {
    return next(new Error(validation.message));
  }
  
  try {
    // Generate salt with 12 rounds (industry standard)
    const salt = await bcrypt.genSalt(12);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if password needs to be rehashed (for security updates)
UserSchema.methods.needsRehash = async function() {
  return await bcrypt.getRounds(this.password) < 12;
};

// Method to change password with validation
UserSchema.methods.changePassword = async function(currentPassword, newPassword) {
  // Verify current password
  const isCurrentPasswordValid = await this.matchPassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new Error('Current password is incorrect');
  }
  
  // Validate new password strength using utility function
  const validation = validatePasswordStrength(newPassword);
  if (!validation.isValid) {
    throw new Error(validation.message);
  }
  
  // Update password (will be hashed by pre-save middleware)
  this.password = newPassword;
  await this.save();
  
  return true;
};

module.exports = mongoose.model("User", UserSchema);
