const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  eventType: [{
    type: String,
    enum: ['Academic', 'Sport', 'Cultural', 'Meeting', 'Other'],
    default:'Other',
  }],
  targetAudience: [{
    type:String,
    enum: ['All', 'Teachers', 'Students', 'Parents', 'Staff'],
    default:'All',
  }],
  status: {
    type: String, 
    enum: ["upcoming", "ongoing","completed","cancelled"],
    default: "upcoming"
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
