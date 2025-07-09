const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Academics/assignmentSubmissionController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadAssignmentSubmission } = require('../../middlewares/upload');

// Student submits assignment
router.post(
  '/',
  protect,
  checkRole('student'),
  uploadAssignmentSubmission.single('file'),
  controller.submitAssignment
);

// Teacher/Admin view all submissions for assignment
router.get(
  '/:assignmentId',
  protect,
  checkRole('teacher', 'admin'),
  controller.getSubmissionsForAssignment
);
// Grade a submission (teacher/admin)
router.put(
  '/grade/:id',
  protect,
  checkRole('teacher', 'admin'),
  controller.gradeSubmission
);
// Export grades for an assignment
router.get(
  '/export/:assignmentId',
  protect,
  checkRole('teacher', 'admin'),
  controller.exportGradesToExcel
);



module.exports = router;
