const express = require("express");
const router = express.Router();
const feeController = require("../../controllers/Administrative/feeController");
const { protect, checkRole } = require("../../middlewares/authMiddleware");
const {uploadBankInfoStorage} = require("../../middlewares/upload");

// Admin routes
router.post("/", protect, checkRole("admin", "superadmin"), uploadBankInfoStorage.single("receipt"), feeController.createFee);
router.get("/", protect, checkRole("admin", "superadmin"), feeController.getAllFees);
router.put("/:id", protect, checkRole("admin", "superadmin"), feeController.updateFee);
router.delete("/:id", protect, checkRole("admin", "superadmin"), feeController.deleteFee);

router.post(
  "/:id/pay-term",
  protect,
  checkRole("parent", "admin"),
  uploadBankInfoStorage.single("receipt"),
  feeController.payTermFee
);

// Student/Parent access
router.get("/student/:studentId", protect, checkRole("student", "parent", "admin"), feeController.getStudentFees);

module.exports = router;




