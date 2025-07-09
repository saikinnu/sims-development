const express = require('express');
const router = express.Router();
const { loginStudent, loginParent, loginAdmin, loginTeacher,logoutUser  } = require('../../controllers/CoreUserController/authController');

// POST /api/auth/student/login
router.post('/student/login', loginStudent);
router.post('/parent/login', loginParent);
router.post("/admin/login", loginAdmin);
router.post("/teacher/login", loginTeacher);
// 🚪 Logout (for all roles)
router.post("/logout", logoutUser);

module.exports = router;
