const express = require('express');
const router = express.Router();
const {createStudent,getAllStudents,getStudentById,updateStudent,deleteStudent,getMyProfile, getStudentCount, getExamDataForStudent, getStudentByUserId} = require('../../controllers/CoreUserController/studentController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const multer = require('multer');
const { uploadStudentProfile } = require('../../middlewares/upload');

// Create student – only admin or superadmin
router.post(
  '/',
  protect,
  checkRole('admin', 'superadmin'),
  uploadStudentProfile.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]),
  createStudent
);

// Read all – any authenticated user
// router.get('/', protect, getAllStudents);
router.get('/', protect,getAllStudents);
router.get('/count', getStudentCount);
router.get('/:id', protect, getStudentById);

// Update – only admin or superadmin
// router.put(
//   '/:id',
//   protect,
//   checkRole('admin', 'superadmin'),
//   uploadStudentProfile.single('profile_image'),
//   updateStudent
// );
router.put(
  '/:id',
  uploadStudentProfile.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]),
  updateStudent
);


// Delete – only superadmin
router.delete('/:id', protect, checkRole('admin','superadmin'), deleteStudent);

// Get own profile
router.get('/me', protect, checkRole('student'), getMyProfile);

// Exam data for student (for exam module)
router.get('/exams/:studentId', protect, checkRole('student', 'parent', 'teacher', 'admin'), getExamDataForStudent);

// Get student by user_id
router.get('/by-userid/:userId', protect, checkRole('student', 'parent', 'teacher', 'admin'), getStudentByUserId);


module.exports = router;
