const express = require("express");
const router = express.Router();
const { uploadBankDetails, getLatestBankDetails,deleteBankDetails,updateBankDetails } = require("../../controllers/Administrative/bankController");
const { protect, checkRole } = require("../../middlewares/authMiddleware");
const {uploadBankInfoStorage} = require("../../middlewares/upload");

router.post("/", protect, checkRole("admin"), uploadBankInfoStorage.single("qr_code"), uploadBankDetails);
router.get("/", protect, getLatestBankDetails);
router.put("/:id",protect,checkRole("admin"),updateBankDetails);
router.delete("/:id",protect,checkRole("admin"),deleteBankDetails);

module.exports = router;
