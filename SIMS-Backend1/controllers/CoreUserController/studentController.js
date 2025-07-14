const Student = require('../../models/CoreUser/Student');
const User = require('../../models/CoreUser/User');
const cloudinary = require('../../config/cloudinary');
const bcrypt = require("bcryptjs");
const Subject = require('../../models/AcademicSchema/Subject');
const StudentMarks = require('../../models/Attendance_PerformanceSchema/StudentMarks');
const Class = require('../../models/AcademicSchema/Class');


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
      contact,
      status,
      student_type,
      previous_school_name,
      previous_school_address,
      previous_school_phone_number,
      previous_school_start_date,
      previous_school_end_date,
      documents
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

    // Password will be automatically hashed by the User model middleware
    let profile_image = {};
    if (req.files && req.files['profile_image'] && req.files['profile_image'][0]) {
      profile_image = {
        public_id: req.files['profile_image'][0].filename,
        url: req.files['profile_image'][0].path,
      };
    }

    let docs = documents || [];
    if (req.files && req.files['documents']) {
      docs = req.files['documents'].map(file => ({
        url: file.path,
        name: file.originalname
      }));
    }

    const student = await Student.create({
      user_id,
      password, // Will be hashed by User model middleware
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
      contact,
      status,
      student_type,
      previous_school_name,
      previous_school_address,
      previous_school_phone_number,
      previous_school_start_date,
      previous_school_end_date,
      documents: docs,
    });

    const newStudent = await User.create({
      user_id,
      email,
      password, // Will be hashed by User model middleware
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

    // Only update fields that exist in the schema
    const allowedFields = [
      'user_id', 'full_name', 'admission_number', 'email', 'date_of_birth', 'gender', 'address', 'parent_id', 'class_id', 'blood_group', 'medical_notes', 'profile_image', 'contact', 'status', 'student_type', 'previous_school_name', 'previous_school_address', 'previous_school_phone_number', 'previous_school_start_date', 'previous_school_end_date', 'documents'
    ];
    Object.keys(updates).forEach(key => {
      if (!allowedFields.includes(key)) delete updates[key];
    });

    // Handle profile image update
    if (req.files && req.files['profile_image'] && req.files['profile_image'][0]) {
      if (student.profile_image?.public_id) {
        await cloudinary.uploader.destroy(student.profile_image.public_id);
      }
      updates.profile_image = {
        public_id: req.files['profile_image'][0].filename,
        url: req.files['profile_image'][0].path,
      };
    }

    // Handle document updates
    if (req.files && req.files['documents']) {
      updates.documents = req.files['documents'].map(file => ({
        url: file.path,
        name: file.originalname
      }));
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

    const student = await Student.findOne({ user_id: req.user._id })
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

// Get total student count
exports.getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get exam data for a student (for frontend exam module)
exports.getExamDataForStudent = async (req, res) => {
  try {
    // 1. Get student info
    const student = await Student.findOne({ user_id: req.params.studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // 2. Get class info (for class name/section)
    let className = '';
    let section = '';
    if (student.class_id) {
      const classObj = await Class.findOne({ _id: student.class_id });
      if (classObj) {
        className = classObj.class_name || '';
        section = classObj.section || '';
      }
    }

    // 3. Get all subjects
    const subjects = await Subject.find();
    const subjectsConfig = {};
    subjects.forEach(subj => {
      subjectsConfig[subj.name] = {
        maxMarks: subj.maxMarks,
        passingMarks: subj.passingMarks
      };
    });

    // 4. Get marks for this student
    const marksDocs = await StudentMarks.find({ student_id: student._id }).populate('subject_id');
    const marks = {};
    marksDocs.forEach(markDoc => {
      if (markDoc.subject_id && markDoc.subject_id.name) {
        marks[markDoc.subject_id.name] = markDoc.marks_obtained;
      }
    });

    // 5. Build response
    const response = {
      student: {
        id: student.user_id,
        rollNo: student.admission_number,
        name: student.full_name,
        class: className,
        section: section,
        marks: marks
      },
      subjectsConfig
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get student by user_id
exports.getStudentByUserId = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.params.userId })
      .populate('parent_id', 'full_name')
      .populate('class_id', 'name');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
