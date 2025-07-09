const Teacher = require('../../models/CoreUser/Teacher');
const User = require('../../models/CoreUser/User');
const cloudinary = require('cloudinary').v2;
const bcrypt = require("bcryptjs");


// Create Teacher
exports.createTeacher = async (req, res) => {
  try {
    const {
      user_id,
      full_name,
      email,
      password,
      phone,
      address,
      qualification,
      class_teacher
      // teacher_id
    } = req.body;

    // Safely parse JSON strings for array fields
    const subjects_taught = JSON.parse(req.body.subjects_taught || '[]');
    const assigned_classes = JSON.parse(req.body.assigned_classes || '[]');

    const hashedPassword = await bcrypt.hash(password, 10);

    // let profile_image = {};
    // if (req.files['profile_image']) {
    //   const img = req.files['profile_image'][0];
    //   profile_image = {
    //     public_id: img.filename,
    //     url: img.path,
    //   };
    // }

    // const certificates = [];
    // if (req.files['certificates']) {
    //   req.files['certificates'].forEach(file => {
    //     certificates.push({
    //       public_id: file.filename,
    //       url: file.path,
    //     });
    //   });
    // }

    const teacher = await Teacher.create({
      user_id,
      full_name,
      email,
      password: hashedPassword,
      role: 'teacher',
      phone,
      address,
      qualification,
      // subjects_taught: JSON.parse(subjects_taught),
      subjects_taught,
      assigned_classes,
      class_teacher,
      // profile_image,
      // certificates
    });

    const newTeacher = await User.create({
      user_id,
      email,
      password: hashedPassword,
      role: 'teacher',
    });

    // await teacher.save();
    res.status(201).json(teacher, newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user_id', 'email full_name');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Teacher
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('teacher_id', 'email');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    console.log(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const {
      full_name,
      phone,
      subjects_taught, // These will already be arrays
      assigned_classes, // These will already be arrays
      class_teacher,
      email,
      password,
      address,
    } = req.body;
    console.log(req.body);

    // Create an object to hold the updates, starting with all fields from req.body
    const updatesToApply = { ...req.body };

    // No need to parse subjects_taught and assigned_classes, they are already arrays from the frontend.
    // Ensure they are directly assigned if present.
    if (subjects_taught !== undefined) { // Check for undefined to allow empty arrays
      updatesToApply.subjects_taught = subjects_taught;
    }
    if (assigned_classes !== undefined) { // Check for undefined to allow empty arrays
      updatesToApply.assigned_classes = assigned_classes;
    }

    // Apply all updates from the `updatesToApply` object to the teacher document.
    Object.assign(teacher, updatesToApply);

    const updatedTeacher = await teacher.save();
    res.json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Teacher
exports.deleteTeacher = async (req, res) => {
  console.log('delete teacher is working fine');
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Optional: remove Cloudinary files
    // if (teacher.profile_image?.public_id) {
    //   await cloudinary.uploader.destroy(teacher.profile_image.public_id);
    // }

    // for (let cert of teacher.certificates || []) {
    //   if (cert.public_id) await cloudinary.uploader.destroy(cert.public_id);
    // }

    await teacher.deleteOne();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeacherProfile = async (req, res) => {
  try {
    const teacherProfile = await Teacher.findOne({ teacher_id: req.user._id });

    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    res.status(200).json(teacherProfile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// module.exports = {
//   createTeacher,
//   // other controller functions
// };