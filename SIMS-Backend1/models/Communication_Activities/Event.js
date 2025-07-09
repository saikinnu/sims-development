const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  event_date: {
    type: Date,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  organizer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assumes you have a User model
    required: true,
  },
  event_image: {
    type: String, // Cloudinary URL
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
