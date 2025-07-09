const express = require('express');
const router = express.Router();
const homeworkController = require('../../controllers/Communication_Activities/homeworkController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadHomeworkFile } = require('../../middlewares/upload');

// Create homework (teachers only)
router.post(
  '/',
  protect,
  checkRole('teacher'),
  uploadHomeworkFile.single('attachment'),
  homeworkController.createHomework
);

// Get all homework (teachers, students, parents, admin)
router.get(
  '/',
  protect,
  checkRole('teacher', 'admin', 'student', 'parent'),
  homeworkController.getAllHomework
);

// Get single assignment
router.get(
  '/:id',
  protect,
  checkRole('teacher', 'admin', 'student', 'parent'),
  homeworkController.getHomeworkById
);

// Update (teacher who created or admin)
router.put(
  '/:id',
  protect,
  checkRole('teacher', 'admin'),
  uploadHomeworkFile.single('attachment'),
  homeworkController.updateHomework
);

// Delete (teacher who created or admin)
router.delete(
  '/:id',
  protect,
  checkRole('teacher', 'admin'),
  homeworkController.deleteHomework
);

module.exports = router;
