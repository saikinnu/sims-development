const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParentSchema = new Schema(
  {
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    },
    occupation: {
      type: String,
    },
    address: {
      type: String,
    },
    relationship: {
      type: String,
      enum: ['Mother', 'Father', 'Guardian'],
      required: true,
    },
    profileImage: {
      type: String, // Cloudinary URL
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Parent', ParentSchema);
