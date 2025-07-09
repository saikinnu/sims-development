const express = require('express');
const router = express.Router();
const teacherAttendanceController = require('../../controllers/Attendance_Performance/teacherAttendanceController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadTeacherProof } = require('../../middlewares/upload');

// POST - Mark attendance (admin/teacher)
router.post(
  '/',
  protect,
  checkRole('teacher', 'admin'),
  uploadTeacherProof.single('supportingDocument'),
  teacherAttendanceController.markAttendance
);

// GET - All attendance (admin)
router.get(
  '/',
  protect,
  checkRole('admin'),
  teacherAttendanceController.getAllAttendance
);

// GET - By teacher ID (admin/teacher)
router.get(
  '/teacher/:teacherId',
  protect,
  checkRole('admin', 'teacher'),
  teacherAttendanceController.getAttendanceByTeacher
);

// PUT - Update attendance (admin only)
router.put(
  '/:id',
  protect,
  checkRole('admin'),
  uploadTeacherProof.single('supportingDocument'),
  teacherAttendanceController.updateAttendance
);

// DELETE - Delete attendance (admin only)
router.delete(
  '/:id',
  protect,
  checkRole('admin'),
  teacherAttendanceController.deleteAttendance
);

router.get('/monthly-report', protect, checkRole('admin', 'teacher'), teacherAttendanceController.getTeacherMonthlyReport);
router.get('/export/excel/:teacherId', protect, checkRole('admin'), teacherAttendanceController.exportTeacherAttendanceExcel);



module.exports = router;
