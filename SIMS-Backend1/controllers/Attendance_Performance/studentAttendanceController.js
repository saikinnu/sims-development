const StudentAttendance = require('../../models/Attendance_PerformanceSchema/StudentAttendance');
const ExcelJS = require('exceljs');
const moment = require('moment');

// ✅ Create attendance record
exports.markAttendance = async (req, res) => {
    try {
        const { student_id, date, status, remarks } = req.body;

        const attendance = new StudentAttendance({
            student_id,
            date,
            status,
            remarks,
            proofImage: req.file?.path || undefined,
        });

        await attendance.save();

        if (status === 'Absent') {
            const student = await Student.findById(student_id).populate('parent_id');
            const parentPhone = student.parent_id.phone;
            const parentEmail = student.parent_id.email;

            // Send SMS using Twilio
            await twilioClient.messages.create({
                body: `Your child ${student.full_name} was absent on ${date}.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+91${parentPhone}`,
            });

            // Send Email using Nodemailer
            await transporter.sendMail({
                to: parentEmail,
                subject: "Student Absence Notification",
                text: `Your child ${student.full_name} was absent on ${date}.`,
            });
        }

        res.status(201).json(attendance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ✅ Get all attendance records
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await StudentAttendance.find()
            .populate('student_id', 'full_name admission_number');
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get attendance by student
exports.getAttendanceByStudent = async (req, res) => {
    try {
        const records = await StudentAttendance.find({ student_id: req.params.studentId });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Update attendance
exports.updateAttendance = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const record = await StudentAttendance.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Attendance record not found' });

        if (status) record.status = status;
        if (remarks) record.remarks = remarks;
        if (req.file) record.proofImage = req.file.path;

        await record.save();
        res.json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ✅ Delete attendance
exports.deleteAttendance = async (req, res) => {
    try {
        const record = await StudentAttendance.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        await record.deleteOne();
        res.json({ message: 'Attendance record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMonthlyReport = async (req, res) => {
  const { studentId, month, year } = req.query;

  const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
  const endDate = moment(startDate).endOf('month').toDate();

  try {
    const records = await StudentAttendance.find({
      student_id: studentId,
      date: { $gte: startDate, $lte: endDate },
    });

    const summary = {
      totalDays: records.length,
      present: records.filter(r => r.status === 'Present').length,
      absent: records.filter(r => r.status === 'Absent').length,
      late: records.filter(r => r.status === 'Late').length,
    };

    res.json({ records, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportAttendanceExcel = async (req, res) => {
  const { studentId } = req.params;
  const records = await StudentAttendance.find({ student_id: studentId });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance');

  worksheet.columns = [
    { header: 'Date', key: 'date' },
    { header: 'Status', key: 'status' },
    { header: 'Remarks', key: 'remarks' },
  ];

  records.forEach(r => worksheet.addRow({ ...r.toObject(), date: r.date.toDateString() }));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};

// BULK: Get all students' attendance for a specific date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();
    const records = await StudentAttendance.find({
      date: { $gte: start, $lte: end }
    }).populate('student_id', 'full_name admission_number');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BULK: Set/update attendance for all students for a specific date
exports.setBulkAttendance = async (req, res) => {
  console.log(req.body);
  try {
    const { date, records } = req.body; // records: [{ student_id, status, remarks }]
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Date and records array are required' });
    }
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();
    const results = [];
    for (const rec of records) {
      let attendance = await StudentAttendance.findOne({
        student_id: rec.student_id,
        date: { $gte: start, $lte: end }
      });
      if (attendance) {
        attendance.status = rec.status;
        if (rec.remarks) attendance.remarks = rec.remarks;
        await attendance.save();
      } else {
        attendance = new StudentAttendance({
          student_id: rec.student_id,
          date,
          status: rec.status,
          remarks: rec.remarks || '',
        });
        await attendance.save();
      }
      results.push(attendance);
    }
    res.json({ updated: results.length, records: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
