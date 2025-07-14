const Admin = require("../../models/CoreUser/Admin");
const User = require('../../models/CoreUser/User');
const bcrypt = require("bcryptjs");
const Student = require("../../models/CoreUser/Student");
const Teacher = require("../../models/CoreUser/Teacher");
const Parent = require("../../models/CoreUser/Parent");
const AdminStaff = require("../../models/CoreUser/AdminStaff");

// 📌 SuperAdmin creates Admin
exports.createAdmin = async (req, res) => {
  try {
    const { school_name, email, user_id, password, plan_type } = req.body;

    // if (password !== confirm_password) {
    //   return res.status(400).json({ message: "Passwords do not match" });
    // }

    // Password will be automatically hashed by the User model middleware

    // Set renewal date
    const now = new Date();
    let renewal_date;
    if (plan_type === "monthly") {
      renewal_date = new Date(now.setDate(now.getDate() + 30));
    } else if (plan_type === "yearly") {
      renewal_date = new Date(now.setFullYear(now.getFullYear() + 1));
    }

    const newAdmin = await Admin.create({
      school_name,
      email,
      user_id,
      password, // Will be hashed by User model middleware
      plan_type,
      renewal_date,
      status: "Active",
    });
    // Save to User schema
    const newUser = await User.create({
      user_id,
      email,
      password, // Will be hashed by User model middleware
      role: 'admin',
    });


    res.status(201).json(newAdmin,newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get all admins
exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.find().select("-password");
  res.json(admins);
};

// 🖊️ Update admin (status or password)
exports.updateAdmin = async (req, res) => {
  try {
    const { password, status, plan_type } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Optionally change password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    if (status) admin.status = status;
    if (plan_type) {
      admin.plan_type = plan_type;
      const now = new Date();
      admin.renewal_date =
        plan_type === "Monthly"
          ? new Date(now.setDate(now.getDate() + 30))
          : new Date(now.setFullYear(now.getFullYear() + 1));
    }

    await admin.save();
    res.json(admin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get user counts for dashboard
exports.getUserCounts = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const parentCount = await Parent.countDocuments();
    const staffCount = await AdminStaff.countDocuments();
    res.json({ studentCount, teacherCount, parentCount, staffCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get total students, teachers, and parents only
exports.getStudentTeacherParentCounts = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const parentCount = await Parent.countDocuments();
    res.json({ studentCount, teacherCount, parentCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
