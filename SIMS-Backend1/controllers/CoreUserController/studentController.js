const Student = require('../../models/CoreUser/Student');
const User = require('../../models/CoreUser/User');
const cloudinary = require('../../config/cloudinary');
const bcrypt = require("bcryptjs");


// Create student
exports.createStudent = async (req, res) => {
  try {
    const {
      user_id,
      password,
      full_name,
      email,
      admission_number,
      date_of_birth,
      gender,
      address,
      parent_id,
      class_id,
      blood_group,
      medical_notes,
      // profile_image
    } = req.body;
    // console.log(req.body);
    if (!user_id || !admission_number || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for duplicate in Student
    const existingStudent = await Student.findOne({ 
      $or: [
        { user_id },
        { admission_number }
      ]
    });
    if (existingStudent) {
      return res.status(400).json({ message: "Student ID or Admission Number already exists" });
    }



    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists in User collection" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profile_image = {};
    if (req.file) {
      profile_image = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    const student = await Student.create({
      user_id,
      password: hashedPassword,
      role: 'student',
      full_name,
      email,
      admission_number,
      date_of_birth,
      gender,
      address,
      parent_id,
      class_id,
      blood_group,
      medical_notes,
      profile_image,
    });

    const newStudent = await User.create({
      user_id,
      email,
      password: hashedPassword,
      role: 'student',
    });

    // await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all students
// exports.getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find()
//       .populate('student_id', 'email role')
//       .populate('parent_id', 'full_name')
//       .populate('class_id', 'name');
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user_id', 'email role')       // Changed from student_id to user_id
      .populate('parent_id', 'full_name')
      .populate('class_id', 'name')
      .select('-password');
      // .populate('password','password')                    // Exclude password field

    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ 
      message: 'Failed to fetch students',
      error: err.message 
    });
  }
};

// Get single student
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('student_id', 'email role')
      .populate('parent_id', 'full_name')
      .populate('class_id', 'name');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const updates = req.body;

    // Handle profile image update
    if (req.file) {
      if (student.profile_image?.public_id) {
        await cloudinary.uploader.destroy(student.profile_image.public_id);
      }
      updates.profile_image = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    Object.assign(student, updates);
    const updated = await student.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.profile_image?.public_id) {
      await cloudinary.uploader.destroy(student.profile_image.public_id);
    }

    await student.deleteOne();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current student profile by logged-in user ID
exports.getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can access this' });
    }

    const student = await Student.findOne({ student_id: req.user._id })
      .populate('parent_id', 'full_name')
      .populate('class_id', 'name');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
