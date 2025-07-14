const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const messageController = require('../../controllers/Communication_Activities/messageController');
const {uploadMessageStorage} = require('../../middlewares/upload');

// Send or save message (sent or draft)
router.post(
  "/",
  protect,
  checkRole("parent", "teacher", "admin","student"),
  uploadMessageStorage.array("attachments", 5),
  messageController.sendOrSaveMessage
);

// Get messages with filters (inbox, sent, drafts, starred, trash, search, etc.)
router.get(
  '/',
  protect,
  checkRole('parent', 'teacher', 'admin',"student"),
  messageController.getMessages
);

// Mark as read
router.put('/:id/read', protect, checkRole('parent', 'teacher', 'admin',"student"), messageController.markAsRead);

// Move to trash
router.patch('/:id/delete', protect, checkRole('parent', 'teacher', 'admin',"student"), messageController.deleteMessage);

// Undo delete (restore from trash)
router.patch('/:id/undo', protect, checkRole('parent', 'teacher', 'admin',"student"), messageController.undoDelete);

// Permanent delete
router.delete('/:id', protect, checkRole('parent', 'teacher', 'admin',"student"), messageController.permanentDelete);

// Toggle star
router.patch('/:id/star', protect, checkRole('parent', 'teacher', 'admin',"student"), messageController.toggleStar);

module.exports = router;
