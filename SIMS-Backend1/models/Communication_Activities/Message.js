// models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    subject: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "draft", "trash"],
      default: "sent",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
    starred: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    attachments: [
      {
        public_id: String,
        url: String,
        name: String,
      },
    ],
    // For compatibility with old schema
    role: {
      type: String,
      enum: ["parent", "teacher", "admin"],
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
