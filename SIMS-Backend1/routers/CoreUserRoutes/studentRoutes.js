const express = require('express');
const router = express.Router();
const {createStudent,getAllStudents,getStudentById,updateStudent,deleteStudent,getMyProfile} = require('../../controllers/CoreUserController/studentController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const {uploadStudentProfile,certificateStorage} = require('../../middlewares/upload');

// Create student – only admin or superadmin
router.post(
  '/',
  protect,
  checkRole('admin', 'superadmin'),
  // uploadStudentProfile.single('profile_image'),
  createStudent
);

// Read all – any authenticated user
// router.get('/', protect, getAllStudents);
router.get('/', protect,getAllStudents);
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
  // checkRole('admin', 'superadmin'),
  updateStudent
);


// Delete – only superadmin
router.delete('/:id', protect, checkRole('admin','superadmin'), deleteStudent);

// Get own profile
router.get('/me', protect, checkRole('student'), getMyProfile);


module.exports = router;
