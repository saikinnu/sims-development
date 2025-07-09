const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/Library_Management/bookController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

// 🔐 Protected routes

// Create a book (Admin/Superadmin)
router.post('/', protect, checkRole('admin', 'superadmin'), bookController.createBook);

// Update book (Admin/Superadmin)
router.put('/:id', protect, checkRole('admin', 'superadmin'), bookController.updateBook);

// Delete book (Admin/Superadmin)
router.delete('/:id', protect, checkRole('admin', 'superadmin'), bookController.deleteBook);

// View all books (Admin, Teacher, Student, Parent)
router.get('/', protect, checkRole('admin', 'teacher', 'student', 'parent'), bookController.getAllBooks);

// View book by ID (Admin, Teacher, Student, Parent)
router.get('/:id', protect, checkRole('admin', 'teacher', 'student', 'parent'), bookController.getBookById);

module.exports = router;
