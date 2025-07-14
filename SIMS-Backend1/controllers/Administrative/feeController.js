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
    const {
      student_id,
      student_name,
      class: className,
      section,
      amount,
      first_term,
      second_term,
      third_term,
      overall_status
    } = req.body;

    const fee = await Fee.create({
      student_id,
      student_name,
      class: className,
      section,
      amount,
      first_term,
      second_term,
      third_term,
      overall_status: overall_status || 'Pending',
    });

    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🧾 Get all fee records (Admin only)
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("student_id", "full_name admission_number class_id");
    // Map to frontend structure
    const mapped = fees.map(fee => {
      return {
        id: fee._id,
        studentId: fee.student_id?.admission_number || fee.student_id || '',
        studentName: fee.student_id?.full_name || fee.student_name || '',
        class: fee.class || fee.student_id?.class_id || '',
        section: fee.section || '',
        amount: fee.amount || 0,
        term1Amount: fee.first_term?.amount_due || 0,
        term1Paid: fee.first_term?.status === 'Paid',
        term1Status: fee.first_term?.status || 'Pending',
        term1PaymentDate: fee.first_term?.payment_date ? fee.first_term.payment_date.toISOString().slice(0, 10) : '',
        term1PaymentMethod: fee.first_term?.payment_method || '',
        term1DueDate: fee.first_term?.due_date ? fee.first_term.due_date.toISOString().slice(0, 10) : '',
        term2Amount: fee.second_term?.amount_due || 0,
        term2Paid: fee.second_term?.status === 'Paid',
        term2Status: fee.second_term?.status || 'Pending',
        term2PaymentDate: fee.second_term?.payment_date ? fee.second_term.payment_date.toISOString().slice(0, 10) : '',
        term2PaymentMethod: fee.second_term?.payment_method || '',
        term2DueDate: fee.second_term?.due_date ? fee.second_term.due_date.toISOString().slice(0, 10) : '',
        term3Amount: fee.third_term?.amount_due || 0,
        term3Paid: fee.third_term?.status === 'Paid',
        term3Status: fee.third_term?.status || 'Pending',
        term3PaymentDate: fee.third_term?.payment_date ? fee.third_term.payment_date.toISOString().slice(0, 10) : '',
        term3PaymentMethod: fee.third_term?.payment_method || '',
        term3DueDate: fee.third_term?.due_date ? fee.third_term.due_date.toISOString().slice(0, 10) : '',
        status: fee.overall_status || 'Pending',
      };
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get student's fee history (Student or Parent)
exports.getStudentFees = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const fees = await Fee.find({ student_id: studentId }).populate("student_id", "full_name admission_number class_id");
    // Map to frontend structure
    const mapped = fees.map(fee => {
      return {
        id: fee._id,
        studentId: fee.student_id?.admission_number || fee.student_id || '',
        studentName: fee.student_id?.full_name || fee.student_name || '',
        class: fee.class || fee.student_id?.class_id || '',
        section: fee.section || '',
        amount: fee.amount || 0,
        term1Amount: fee.first_term?.amount_due || 0,
        term1Paid: fee.first_term?.status === 'Paid',
        term1Status: fee.first_term?.status || 'Pending',
        term1PaymentDate: fee.first_term?.payment_date ? fee.first_term.payment_date.toISOString().slice(0, 10) : '',
        term1PaymentMethod: fee.first_term?.payment_method || '',
        term1DueDate: fee.first_term?.due_date ? fee.first_term.due_date.toISOString().slice(0, 10) : '',
        term2Amount: fee.second_term?.amount_due || 0,
        term2Paid: fee.second_term?.status === 'Paid',
        term2Status: fee.second_term?.status || 'Pending',
        term2PaymentDate: fee.second_term?.payment_date ? fee.second_term.payment_date.toISOString().slice(0, 10) : '',
        term2PaymentMethod: fee.second_term?.payment_method || '',
        term2DueDate: fee.second_term?.due_date ? fee.second_term.due_date.toISOString().slice(0, 10) : '',
        term3Amount: fee.third_term?.amount_due || 0,
        term3Paid: fee.third_term?.status === 'Paid',
        term3Status: fee.third_term?.status || 'Pending',
        term3PaymentDate: fee.third_term?.payment_date ? fee.third_term.payment_date.toISOString().slice(0, 10) : '',
        term3PaymentMethod: fee.third_term?.payment_method || '',
        term3DueDate: fee.third_term?.due_date ? fee.third_term.due_date.toISOString().slice(0, 10) : '',
        status: fee.overall_status || 'Pending',
      };
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update a fee entry (Admin)
exports.updateFee = async (req, res) => {
  console.log(req.body);
  try {
    const {
      student_id,
      student_name,
      class: className,
      section,
      amount,
      first_term,
      second_term,
      third_term,
      overall_status
    } = req.body;
    const updated = await Fee.findByIdAndUpdate(
      req.params.id,
      {
        student_id,
        student_name,
        class: className,
        section,
        amount,
        first_term,
        second_term,
        third_term,
        overall_status
      },
      { new: true }
    );
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
