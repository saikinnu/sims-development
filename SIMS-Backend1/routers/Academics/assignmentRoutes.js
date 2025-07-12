const express = require('express');
const router = express.Router();
const assignmentController = require('../../controllers/Academics/assignmentController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadAssignmentFile } = require('../../middlewares/upload');

// 📥 Create assignment (teachers only)
router.post(
  '/',
  protect,
  checkRole('teacher', 'admin'),
  uploadAssignmentFile.single('file'),
  assignmentController.createAssignment
);

// 📚 Get all assignments (public to students, teachers, admins)
router.get(
  '/',
  protect,
  checkRole('student', 'teacher', 'admin'),
  assignmentController.getAllAssignments
);

// 📄 Get single assignment
router.get(
  '/:id',
  protect,
  checkRole('student', 'teacher', 'admin'),
  assignmentController.getAssignmentById
);

// 📝 Update assignment (teacher who created or admin)
router.put(
  '/:id',
  protect,
  checkRole('teacher', 'admin'),
  uploadAssignmentFile.single('file'),
  assignmentController.updateAssignment
);

// ❌ Delete assignment (teacher who created or admin)
router.delete(
  '/:id',
  protect,
  checkRole('teacher', 'admin'),
  assignmentController.deleteAssignment
);

module.exports = router;
