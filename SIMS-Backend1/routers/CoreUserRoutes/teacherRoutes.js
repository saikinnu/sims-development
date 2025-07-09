const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherProfile,
} = require('../../controllers/CoreUserController/teacherController');

const { protect, adminOnly, checkRole } = require('../../middlewares/authMiddleware');
const { uploadProfile } = require('../../middlewares/upload');

// Only superadmin or admin can create
router.post(
  '/',
  protect,
  checkRole('admin', 'superadmin'),
  uploadProfile.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'certificates', maxCount: 5 },
  ]),
  createTeacher
);

router.get('/', protect, getAllTeachers);
router.get('/:id', protect, getTeacherById);
router.get('/profile', protect, checkRole('teacher'), getTeacherProfile);

router.put(
  '/:id',
  protect,
  checkRole('admin', 'superadmin'),
  uploadProfile.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'certificates', maxCount: 5 },
  ]),
  updateTeacher
);

router.delete('/:id', protect, checkRole('admin','superadmin'), deleteTeacher);

module.exports = router;
