const Parent = require('../../models/CoreUser/Parent');
const Student = require('../../models/CoreUser/Student');
const cloudinary = require('../../config/cloudinary');
const User = require('../../models/CoreUser/User');

// CREATE
exports.createParent = async (req, res) => {
  try {
    const { user_id, full_name, email, password, childrenCount, phone, address } = req.body;

    // Basic validation
    if (!user_id || !full_name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parent = await Parent.create({
      user_id,
      full_name,
      email,
      password,
      phone,
      role: 'parent',
      childrenCount: childrenCount || 1, // Default to 1 if not provided
      address: address || '',
    });

    // Create corresponding user
    await User.create({
      user_id,
      email,
      password,
      role: 'parent',
    });

    res.status(201).json(parent);
  } catch (err) {
    console.error('Error creating parent:', err);
    res.status(400).json({ 
      message: err.message.includes('duplicate key') ? 
        'Duplicate user_id or email' : 
        'Failed to create parent',
      error: err.message 
    });
  }
};

// GET ALL
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate('user_id', 'email');
    res.json(parents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate('parent_id', 'email');
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    res.json(parent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const {
      full_name,
      phone,
      // occupation,
      address
      // relationship
    } = req.body;

    // Update fields
    if (full_name) parent.full_name = full_name;
    if (phone) parent.phone = phone;
    // if (occupation) parent.occupation = occupation;
    if (address) parent.address = address;
    // if (relationship) parent.relationship = relationship;

    // Replace profile image if new one uploaded
    // if (req.file) {
    //   // Optional: delete old image from Cloudinary if stored with public_id
    //   parent.profileImage = req.file.path;
    // }

    const updated = await parent.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    // Optional: delete Cloudinary file if needed
    await parent.deleteOne();
    res.json({ message: 'Parent deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyParentProfile = async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied: Parents only' });
    }

    const parent = await Parent.findOne({ parent_id: req.user._id });
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const students = await Student.find({ parent_id: parent._id })
      .populate('class_id', 'name');

    res.json({
      parent,
      linkedStudents: students,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
