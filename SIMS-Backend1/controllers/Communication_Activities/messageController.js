const Message = require("../../models/Communication_Activities/Message");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { recipient, role, message } = req.body;
    let attachments = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "messages",
          resource_type: "auto",
        });
        attachments.push({
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
        });
        fs.unlinkSync(file.path); // Remove local file
      }
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      recipient,
      role,
      message,
      attachments,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 📥 Get messages received by current user
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .populate('sender', 'full_name role')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 📤 Get messages sent by current user
exports.getSentMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .populate('recipient', 'full_name role')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (!message.recipient.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    message.read = true;
    await message.save();
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get received messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id }).populate("sender", "email role");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
