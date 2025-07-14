const Message = require("../../models/Communication_Activities/Message");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// Send or Save Message (sent or draft)
exports.sendOrSaveMessage = async (req, res) => {
  try {
    const { recipients, subject, content, status } = req.body;
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
          name: file.originalname,
        });
        fs.unlinkSync(file.path);
      }
    }
    // Create a message for each recipient
    const messages = await Promise.all(recipients.map(async (recipient) => {
      return await Message.create({
        sender: req.user._id,
        recipients: [recipient],
        subject,
        content,
        status: status || "sent",
        attachments,
        read: false,
        starred: false,
        deletedAt: null,
        date: new Date(),
      });
    }));
    res.status(201).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all messages for current user (inbox, sent, drafts, starred, trash, with filters)
exports.getMessages = async (req, res) => {
  try {
    const { tab, search, status, dateRange } = req.query;
    let filter = {};
    if (tab === 'inbox') {
      filter = {
        recipients: req.user._id,
        status: { $nin: ['draft', 'trash'] },
      };
    } else if (tab === 'sent') {
      filter = {
        sender: req.user._id,
        status: 'sent',
      };
    } else if (tab === 'drafts') {
      filter = {
        sender: req.user._id,
        status: 'draft',
      };
    } else if (tab === 'starred') {
      filter = {
        $or: [
          { sender: req.user._id },
          { recipients: req.user._id },
        ],
        starred: true,
        status: { $ne: 'trash' },
      };
    } else if (tab === 'trash') {
      filter = {
        $or: [
          { sender: req.user._id },
          { recipients: req.user._id },
        ],
        status: 'trash',
      };
    } else {
      filter = {
        $or: [
          { sender: req.user._id },
          { recipients: req.user._id },
        ],
      };
    }
    // Search
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    // Status filter
    if (status) {
      filter.status = status;
    }
    // Date range filter (simplified)
    if (dateRange) {
      const now = new Date();
      let startDate, endDate;
      if (dateRange === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      } else if (dateRange === 'week') {
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.setDate(now.getDate() - now.getDay() + 7));
        endDate.setHours(0, 0, 0, 0);
      } else if (dateRange === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      } else if (dateRange === 'year') {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
      }
      filter.date = { $gte: startDate, $lt: endDate };
    }
    const messages = await Message.find(filter)
      .populate('sender', 'email full_name role')
      .populate('recipients', 'email full_name role')
      .sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (!message.recipients.includes(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    message.read = true;
    await message.save();
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete (move to trash)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (
      !message.sender.equals(req.user._id) &&
      !message.recipients.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    message.status = 'trash';
    message.deletedAt = new Date();
    await message.save();
    res.json({ message: "Moved to trash" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Undo delete (restore from trash)
exports.undoDelete = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (
      !message.sender.equals(req.user._id) &&
      !message.recipients.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    message.status = message.status === 'trash' ? 'sent' : message.status;
    message.deletedAt = null;
    await message.save();
    res.json({ message: "Restored from trash" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Permanent delete
exports.permanentDelete = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (
      !message.sender.equals(req.user._id) &&
      !message.recipients.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await message.deleteOne();
    res.json({ message: "Deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle star
exports.toggleStar = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (
      !message.sender.equals(req.user._id) &&
      !message.recipients.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    message.starred = !message.starred;
    await message.save();
    res.json({ message: "Star status toggled", starred: message.starred });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
