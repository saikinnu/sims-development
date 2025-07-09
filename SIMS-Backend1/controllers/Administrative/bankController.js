const BankDetails = require("../../models/AdministrativeSchema/BankDetails");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// Admin uploads bank details + QR
exports.uploadBankDetails = async (req, res) => {
  try {
    let qr = {};
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "bank_qr",
      });
      qr = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
      fs.unlinkSync(req.file.path);
    }

    const { bank_name, bank_IFSC } = req.body;

    const data = await BankDetails.create({
      bank_name,
      bank_IFSC,
      qr_code: qr,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Anyone can view latest bank info
exports.getLatestBankDetails = async (req, res) => {
  try {
    const latest = await BankDetails.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
