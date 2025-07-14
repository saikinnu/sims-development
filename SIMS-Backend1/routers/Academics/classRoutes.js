const express = require('express');
const router = express.Router();
const classController = require('../../controllers/Academics/classController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// Create a class (admin only)
router.post(
  '/',
  protect,
  checkRole('admin', 'superadmin','teacher'),
  classController.createClass
);

// Get all classes
router.get(
  '/',
  protect,
  checkRole('admin', 'superadmin', 'teacher', 'student'),
  classController.getAllClasses
);

// Get class by ID
router.get(
  '/:id',
  protect,
  checkRole('admin', 'superadmin', 'teacher', 'student'),
  classController.getClassById
);

// Update class (admin only)
router.put(
  '/:id',
  protect,
  checkRole('admin', 'superadmin','teacher'),
  classController.updateClass
);

// Delete class (admin only)
router.delete(
  '/:id',
  protect,
  checkRole('admin', 'superadmin','teacher'),
  classController.deleteClass
);

module.exports = router;
