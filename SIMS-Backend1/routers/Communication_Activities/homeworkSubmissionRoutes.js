const express = require('express');
const router = express.Router();
const submissionController = require('../../controllers/Communication_Activities/homeworkSubmissionController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadHomeworkSubmission } = require('../../middlewares/upload');

// Student submits homework
router.post(
  '/',
  protect,
  checkRole('student'),
  uploadHomeworkSubmission.single('file'),
  submissionController.submitHomework
);

// Get all submissions for an assignment (teacher/admin)
router.get(
  '/assignment/:assignmentId',
  protect,
  checkRole('teacher', 'admin'),
  submissionController.getSubmissionsForAssignment
);

module.exports = router;
