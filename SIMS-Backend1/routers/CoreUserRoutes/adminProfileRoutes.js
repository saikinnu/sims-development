const express = require('express');
const router = express.Router();
const adminProfileController = require('../../controllers/CoreUserController/adminProfileController');
const { protect } = require('../../middlewares/authMiddleware');

// Get own profile
router.get('/me', protect, adminProfileController.getOwnProfile);

// Update profile
router.put('/:id', protect, adminProfileController.updateProfile);

// Change password
router.post('/change-password', protect, adminProfileController.changePassword);

module.exports = router;