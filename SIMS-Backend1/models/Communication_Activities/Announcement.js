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
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  publish_date: {
    type: Date,
    default: Date.now,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  target_role: {
    type: String,
    enum: ['All', 'Students', 'Teachers', 'Parents'],
    default: 'All',
  },
  media: {
    public_id: String,
    url: String,
  },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
