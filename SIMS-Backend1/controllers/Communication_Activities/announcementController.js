const Announcement = require('../../models/Communication_Activities/Announcement');

// 📢 Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, target, startDate, endDate, status } = req.body;
    const announcement = await Announcement.create({
      title,
      content,
      target,
      startDate,
      endDate,
      status
    });
    res.status(201).json(announcement);
  } catch (error) {
    console.log('not working fine');
    res.status(400).json({ message: error.message });
  }
};

// 📚 Get all announcements (role-specific + unexpired)
exports.getAnnouncements = async (req, res) => {
  try {
    const role = req.user.role;
    const now = new Date();
    const announcements = await Announcement.find().sort({ publish_date: -1 });

    // const announcements = await Announcement.find({
    //   $and: [
    //     {
    //       $or: [
    //         { target: 'All' },
    //         { target: role === 'Student' ? 'Students' : role === 'Teacher' ? 'Teachers' : role === 'Parent' ? 'Parents' : 'All' }
    //       ]
    //     },
    //     { expiry_date: { $gte: now } }
    //   ]
    // }).sort({ publish_date: -1 });

    res.json(announcements);
  } catch (err) {
    console.log('announcements not working fine');
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get single announcement
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('author_id', 'full_name');
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Announcement not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
