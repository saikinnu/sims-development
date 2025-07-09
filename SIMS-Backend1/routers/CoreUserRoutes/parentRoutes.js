const express = require('express');
const router = express.Router();
const parentController = require('../../controllers/CoreUserController/parentController');
const parentPortalController = require('../../controllers/CoreUserController/parentPortalController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const { uploadParentProfile } = require('../../middlewares/upload');

// CREATE
router.post(
  '/',
  protect,
  checkRole('admin', 'superadmin'),
  uploadParentProfile.single('profileImage'),
  parentController.createParent
);

// READ ALL
router.get('/', protect, parentController.getAllParents);

// READ ONE
router.get('/:id', protect, parentController.getParentById);

// UPDATE
router.put(
  '/:id',
  protect,
  checkRole('admin', 'superadmin'),
  uploadParentProfile.single('profileImage'),
  parentController.updateParent
);

// DELETE
router.delete(
  '/:id',
  protect,
  checkRole('admin','superadmin'),
  parentController.deleteParent
);

// Get logged-in parent profile and linked students
router.get('/me', protect, checkRole('parent'), parentController.getMyParentProfile);
router.get('/dashboard', protect, checkRole('parent'), parentPortalController.getParentDashboard);

module.exports = router;
