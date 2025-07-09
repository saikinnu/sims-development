const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/Communication_Activities/eventController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// 🔐 Admin-only routes
router.post('/', protect, checkRole('admin', 'superadmin'), eventController.createEvent);
router.put('/:id', protect, checkRole('admin', 'superadmin'), eventController.updateEvent);
router.delete('/:id', protect, checkRole('admin', 'superadmin'), eventController.deleteEvent);

// 🔓 Accessible to all roles
router.get('/', protect, checkRole('admin', 'teacher', 'student', 'parent'), eventController.getAllEvents);
router.get('/:id', protect, checkRole('admin', 'teacher', 'student', 'parent'), eventController.getEventById);

module.exports = router;
