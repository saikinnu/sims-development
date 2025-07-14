const Parent = require('../../models/CoreUser/Parent');
const Student = require('../../models/CoreUser/Student');
const cloudinary = require('../../config/cloudinary');
const User = require('../../models/CoreUser/User');
const bcrypt = require("bcryptjs");
const { getParentStudents, removeStudentFromParent } = require('../../utils/relationshipUtils');

// CREATE
exports.createParent = async (req, res) => {
  try {
    const { user_id, full_name, email, password, childrenCount, phone, address } = req.body;

    // Basic validation
    if (!user_id || !full_name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    // Create User first (password will be automatically hashed by User model middleware)
    const newUser = await User.create({
      user_id,
      email,
      password,
      role: 'parent',
    });

    // Create Parent profile referencing the User
    const parent = await Parent.create({
      user_id: newUser._id, // Reference the User's ObjectId
      full_name,
      email,
      phone,
      role: 'parent',
      childrenCount: childrenCount || 1, // Default to 1 if not provided
      address: address || '',
    });

    res.status(201).json({
      message: 'Parent created successfully',
      parent,
      user: {
        id: newUser._id,
        user_id: newUser.user_id,
        email: newUser.email,
        role: newUser.role
      }
    });
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
    const parents = await Parent.find()
      .populate('user_id', 'user_id email role -_id')
      .populate('children', 'full_name admission_number class_id email contact status')
      .select('-__v');
    res.json(parents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id)
      .populate('user_id', 'user_id email role -_id')
      .populate('children', 'full_name admission_number class_id email contact status');
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
    console.log('getMyParentProfile called with user:', req.user);

    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Access denied: Parents only' });
    }

    const parent = await Parent.findOne({ user_id: req.user._id });
    console.log('Found parent:', parent);

    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Find students where parent_id array contains the parent's _id
    const students = await Student.find({
      parent_id: { $in: [parent._id.toString()] }
    });
    console.log('Found students:', students.length);

    // Since class_id is stored as string, we need to fetch class details separately
    const studentsWithClassDetails = await Promise.all(
      students.map(async (student) => {
        let classDetails = null;
        if (student.class_id) {
          try {
            const Class = require('../../models/AcademicSchema/Class');
            classDetails = await Class.findOne({ class_name: student.class_id });
            console.log('Found class details for', student.class_id, ':', classDetails);
          } catch (err) {
            console.error('Error fetching class details:', err);
          }
        }

        return {
          ...student.toObject(),
          class_id: classDetails
        };
      })
    );

    console.log('Sending response with', studentsWithClassDetails.length, 'students');
    res.json({
      parent,
      linkedStudents: studentsWithClassDetails,
    });
  } catch (err) {
    console.error('Error in getMyParentProfile:', err);
    res.status(500).json({ message: err.message });
  }
};
// Get total student count
exports.getParentCount = async (req, res) => {
  console.log('getParentCount called');
  try {
    console.log('Attempting to count parents...'); // Debug log
    const count = await Parent.countDocuments();
    console.log(`Found ${count} parents`); // Debug log
    res.json({ count });
  } catch (err) {
    console.error('Error in getParentCount:', err); // Detailed error log
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};