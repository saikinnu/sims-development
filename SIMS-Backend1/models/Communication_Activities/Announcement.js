const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  target: [{
    type:String,
    enum: ['All', 'Teachers', 'Students', 'Parents', 'Staff'],
    default:'All',
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String, 
    enum: ["active","draft"],
    default: "active"
  },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
