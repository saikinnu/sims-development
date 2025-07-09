// models/Notification.js

const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    media_url: {
      type: String, // Cloudinary image/file URL if attached
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
