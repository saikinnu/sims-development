const BankDetails = require("../../models/AdministrativeSchema/BankDetails");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// Admin uploads bank details + QR
exports.uploadBankDetails = async (req, res) => {
  try {
    // let qr = {};
    // if (req.file) {
    //   const uploaded = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "bank_qr",
    //   });
    //   qr = {
    //     public_id: uploaded.public_id,
    //     url: uploaded.secure_url,
    //   };
    //   fs.unlinkSync(req.file.path);
    // }

    const { bankName, accountNumber, ifscCode, upiId, qrFileName } = req.body;

    const data = await BankDetails.create({
      bankName,
      accountNumber,
      ifscCode,
      upiId,
      qrFileName
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Anyone can view latest bank info
exports.getLatestBankDetails = async (req, res) => {
  try {
    // const latest = await BankDetails.findOne().sort({ createdAt: -1 });
    const all = await BankDetails.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteBankDetails = async (req, res) => {
  try {
    const deleted = await BankDetails.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bank details not found' });
    res.json({ message: 'Bank details deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateBankDetails = async (req, res) => {
  try {
    const updated = await BankDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Bank details not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
