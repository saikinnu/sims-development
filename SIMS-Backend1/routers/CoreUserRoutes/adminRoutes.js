const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/CoreUserController/adminController");
const { protect, checkRole } = require("../../middlewares/authMiddleware");

// 🧑‍💼 Only SuperAdmins can manage Admins
// router.post("/", protect, checkRole("superadmin"), adminController.createAdmin);
// router.get("/", protect, checkRole("superadmin"), adminController.getAllAdmins);
// router.put("/:id", protect, checkRole("superadmin"), adminController.updateAdmin);
router.post("/", adminController.createAdmin);
router.get("/", adminController.getAllAdmins);
router.put("/:id", adminController.updateAdmin);

module.exports = router;
