const Fee = require("../../models/AdministrativeSchema/Fee");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
// Parent uploads receipt to pay a specific term
exports.payTermFee = async (req, res) => {
  try {
    const { term, amount_paid, payment_date } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    let receipt_url = "";
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "fee_receipts",
      });
      receipt_url = uploaded.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const termData = {
      amount_paid,
      payment_date,
      receipt_url,
      status: "Paid",
    };

    // Update relevant term
    if (term === "first") fee.first_term = { ...fee.first_term, ...termData };
    else if (term === "second") fee.second_term = { ...fee.second_term, ...termData };
    else if (term === "third") fee.third_term = { ...fee.third_term, ...termData };
    else return res.status(400).json({ message: "Invalid term" });

    // Update overall status
    const statuses = [
      fee.first_term?.status,
      fee.second_term?.status,
      fee.third_term?.status,
    ];
    if (statuses.every(s => s === "Paid")) fee.overall_status = "Paid";
    else if (statuses.some(s => s === "Paid")) fee.overall_status = "Partial";
    else fee.overall_status = "Pending";

    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 💵 Add new fee record (Admin)
exports.createFee = async (req, res) => {
  try {
    const { student_id, amount_due, amount_paid, due_date, status, payment_date } = req.body;

    let receipt = {};
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "receipts",
        resource_type: "image",
      });
      receipt.url = uploaded.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const fee = await Fee.create({
      student_id,
      amount_due,
      amount_paid,
      due_date,
      status,
      payment_date,
      receipt_url: receipt.url,
    });

    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🧾 Get all fee records (Admin only)
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("student_id", "full_name admission_number");
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get student's fee history (Student or Parent)
exports.getStudentFees = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const fees = await Fee.find({ student_id: studentId });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update a fee entry (Admin)
exports.updateFee = async (req, res) => {
  try {
    const updated = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Fee record not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete a fee entry
exports.deleteFee = async (req, res) => {
  try {
    const deleted = await Fee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Fee record not found" });
    res.json({ message: "Fee record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
