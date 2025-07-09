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
      // qualification,
      subjects_taught,
      assigned_classes,
      class_teacher,
    } = req.body;
    console.log(req.body);
    const updates = req.body;

    // 1. Update text fields
    if (full_name) teacher.full_name = full_name;
    if (phone) teacher.phone = phone;
    // if (qualification) teacher.qualification = qualification;
    if (subjects_taught) teacher.subjects_taught = JSON.parse(subjects_taught);
    if (assigned_classes) teacher.assigned_classes = JSON.parse(assigned_classes);
    if (class_teacher) teacher.class_teacher = class_teacher;
    if (email) teacher.email = email;
    if (password) teacher.password = password;
    if (address) teacher.address = address;
    // 2. Handle new profile image
    // if (req.files['profile_image']) {
    //   // Delete old profile image from Cloudinary
    //   if (teacher.profile_image?.public_id) {
    //     await cloudinary.uploader.destroy(teacher.profile_image.public_id);
    //   }

    //   const img = req.files['profile_image'][0];
    //   teacher.profile_image = {
    //     public_id: img.filename,
    //     url: img.path,
    //   };
    // }

    // 3. Handle new certificates
    // if (req.files['certificates']) {
    //   // Delete old certificates from Cloudinary
    //   for (let cert of teacher.certificates || []) {
    //     if (cert.public_id) {
    //       await cloudinary.uploader.destroy(cert.public_id);
    //     }
    //   }

    //   teacher.certificates = req.files['certificates'].map(file => ({
    //     public_id: file.filename,
    //     url: file.path,
    //   }));
    // }
    Object.assign(teacher, updates);
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