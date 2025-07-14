const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String },
  classes: [{ type: String }], // e.g., ['Class 8', 'Class 9']
  description: { type: String },
  type: { type: String, enum: ['pdf', 'image', 'video', 'link'], required: true },
  url: { type: String, required: true }, // Cloudinary or external link
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', ResourceSchema); 