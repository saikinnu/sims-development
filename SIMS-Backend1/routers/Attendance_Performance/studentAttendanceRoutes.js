const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/Attendance_Performance/studentAttendanceController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadProof } = require('../../middlewares/upload');

// ✅ POST: Mark attendance
router.post(
  '/',
  protect,
  checkRole('teacher', 'admin'),
  uploadProof.single('proofImage'),
  attendanceController.markAttendance
);

// ✅ GET: All attendance
router.get(
  '/',
  protect,
  checkRole('teacher', 'admin'),
  attendanceController.getAllAttendance
);

// ✅ GET: Student's attendance
router.get(
  '/student/:studentId',
  protect,
  checkRole('teacher', 'admin', 'parent', 'student'),
  attendanceController.getAttendanceByStudent
);

router.get('/monthly-report', protect, checkRole('teacher', 'admin', 'parent'), attendanceController.getMonthlyReport);


// ✅ PUT: Update attendance
router.put(
  '/:id',
  protect,
  checkRole('teacher', 'admin'),
  uploadProof.single('proofImage'),
  attendanceController.updateAttendance
);

// ✅ DELETE: Remove attendance (admin only)
router.delete(
  '/:id',
  protect,
  checkRole('admin'),
  attendanceController.deleteAttendance
);

module.exports = router;
