const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../../middlewares/authMiddleware');
const messageController = require('../../controllers/Communication_Activities/messageController');
const {uploadMessageStorage} = require('../../middlewares/upload');

// router.post('/', protect, messageController.sendMessage);
// router.get('/', protect, messageController.getMessages);
// Allow file attachment on message creation
router.post(
  "/",
  protect,
  checkRole("parent", "teacher", "admin"),
  uploadMessageStorage.array("attachments", 5), // limit to 5 files
  messageController.sendMessage
);
router.get('/inbox', protect, checkRole('parent', 'teacher', 'admin'), messageController.getInbox);
router.get('/sent', protect, checkRole('parent', 'teacher', 'admin'), messageController.getSentMessages);
router.put('/:id/read', protect, checkRole('parent', 'teacher', 'admin'), messageController.markAsRead);

module.exports = router;
