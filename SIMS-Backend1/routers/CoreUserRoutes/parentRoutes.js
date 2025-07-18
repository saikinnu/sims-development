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
  checkRole('admin', 'superadmin','teacher'),
  uploadParentProfile.single('profileImage'),
  parentController.createParent
);

// READ ALL
router.get('/', protect, parentController.getAllParents);

// Get logged-in parent profile and linked students (MUST come before /:id routes)
router.get('/me', protect, checkRole('parent'), parentController.getMyParentProfile);
router.get('/dashboard', protect, checkRole('parent'), parentPortalController.getParentDashboard);

// READ ONE
router.get('/:id', protect, parentController.getParentById);

// UPDATE
router.put(
  '/:id',
  protect,
  checkRole('admin', 'superadmin','teacher'),
  uploadParentProfile.single('profileImage'),
  parentController.updateParent
);

// DELETE
router.delete(
  '/:id',
  protect,
  checkRole('admin','superadmin','teacher'),
  parentController.deleteParent
);
router.get('/count',protect,parentController.getParentCount);

module.exports = router;
