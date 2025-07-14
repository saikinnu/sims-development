const express = require('express');
const router = express.Router();
const resourceController = require('../../controllers/Library_Management/resourceController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// Create a resource (Admin/Superadmin)
router.post('/', protect, checkRole('admin', 'superadmin','teacher'), resourceController.createResource);

// Update resource (Admin/Superadmin)
router.put('/:id', protect, checkRole('admin', 'superadmin','teacher'), resourceController.updateResource);

// Delete resource (Admin/Superadmin)
router.delete('/:id', protect, checkRole('admin', 'superadmin','teacher'), resourceController.deleteResource);

// View all resources (Admin, Teacher, Student, Parent)
router.get('/', protect, checkRole('admin', 'teacher', 'student', 'parent'), resourceController.getAllResources);

// View resource by ID (Admin, Teacher, Student, Parent)
router.get('/:id', protect, checkRole('admin', 'teacher', 'student', 'parent'), resourceController.getResourceById);

module.exports = router; 