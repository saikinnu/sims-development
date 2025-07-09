const express = require('express');
const router = express.Router();
const adminStaffController = require('../../controllers/CoreUserController/adminStaffController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadAdminStaffProfile } = require('../../middlewares/upload');

// Only superadmin can create
router.post(
  '/',
  protect,
  checkRole('superadmin'),
  uploadAdminStaffProfile.single('profileImage'),
  adminStaffController.createAdminStaff
);

// Read all and individual (any logged-in user)
router.get('/', protect, adminStaffController.getAllAdminStaff);
router.get('/:id', protect, adminStaffController.getAdminStaffById);

// Update (only superadmin)
router.put(
  '/:id',
  protect,
  checkRole('superadmin'),
  uploadAdminStaffProfile.single('profileImage'),
  adminStaffController.updateAdminStaff
);

// Delete (only superadmin)
router.delete(
  '/:id',
  protect,
  checkRole('superadmin'),
  adminStaffController.deleteAdminStaff
);

module.exports = router;
