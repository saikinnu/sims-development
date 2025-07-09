const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/Academics/subjectController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// 🔐 Admins can create/update/delete subjects
router.post('/', protect, checkRole('admin', 'superadmin'), subjectController.createSubject);
router.put('/:id', protect, checkRole('admin', 'superadmin'), subjectController.updateSubject);
router.delete('/:id', protect, checkRole('admin', 'superadmin'), subjectController.deleteSubject);

// 📖 All roles can view subjects
router.get('/', protect, checkRole('admin', 'teacher', 'student', 'parent'), subjectController.getAllSubjects);
router.get('/:id', protect, checkRole('admin', 'teacher', 'student', 'parent'), subjectController.getSubjectById);

module.exports = router;
