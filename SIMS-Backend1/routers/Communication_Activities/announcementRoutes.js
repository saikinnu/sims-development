const express = require('express');
const router = express.Router();
const announcementController = require('../../controllers/Communication_Activities/announcementController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// POST: Create announcement (admin/staff only)
router.post('/', protect, checkRole('admin', 'superadmin'), announcementController.createAnnouncement);

// GET: Get announcements (all roles)
router.get('/', protect, checkRole('admin', 'student', 'teacher', 'parent'), announcementController.getAnnouncements);

// GET: Single announcement by ID
router.get('/:id', protect, checkRole('admin', 'student', 'teacher', 'parent'), announcementController.getAnnouncementById);

// PUT: Update announcement
router.put('/:id', protect, checkRole('admin', 'superadmin'), announcementController.updateAnnouncement);

// DELETE: Delete announcement
router.delete('/:id', protect, checkRole('admin', 'superadmin'), announcementController.deleteAnnouncement);

module.exports = router;
