const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Academics/timetableController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// Admins can create/update timetable
router.post(
  '/',
  protect,
  checkRole('admin', 'superadmin'),
  controller.upsertTimetable
);

// Get timetable for class (all roles)
router.get(
  '/class/:classId',
  protect,
  checkRole('admin', 'teacher', 'student', 'parent'),
  controller.getTimetableByClass
);

// Export timetable PDF
router.get(
  '/export/:classId',
  protect,
  checkRole('admin', 'teacher'),
  controller.exportTimetablePDF
);

module.exports = router;
