const express = require('express');
const router = express.Router();
const examController = require('../../controllers/Attendance_Performance/examController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// 📘 Public for admin & staff only
router.post(
  '/',
  protect,
  checkRole('admin', 'superadmin'),
  examController.createExam
);

router.get(
  '/',
  protect,
  checkRole('admin', 'teacher', 'student', 'parent'),
  examController.getAllExams
);

router.get(
  '/:id',
  protect,
  checkRole('admin', 'teacher', 'student', 'parent'),
  examController.getExamById
);

router.put(
  '/:id',
  protect,
  checkRole('admin', 'superadmin'),
  examController.updateExam
);

router.delete(
  '/:id',
  protect,
  checkRole('admin', 'superadmin'),
  examController.deleteExam
);

module.exports = router;
