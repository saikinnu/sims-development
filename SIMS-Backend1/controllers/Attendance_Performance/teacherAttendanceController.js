const TeacherAttendance = require('../../models/Attendance_PerformanceSchema/TeacherAttendance');
const moment = require('moment');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');

// ✅ Mark Teacher Attendance
exports.markAttendance = async (req, res) => {
    try {
        const { teacher_id, date, status } = req.body;

        const attendance = new TeacherAttendance({
            teacher_id,
            date,
            status,
            supportingDocument: req.file?.path,
        });

        await attendance.save();

        if (status === 'Leave') {
            const teacher = await Teacher.findById(teacher_id);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.HR_EMAIL,
                    pass: process.env.HR_PASSWORD,
                },
            });

            await transporter.sendMail({
                to: process.env.HR_EMAIL,
                subject: `Leave Notification: ${teacher.full_name}`,
                text: `${teacher.full_name} has marked leave for ${date}.`,
            });
        }
        res.status(201).json(attendance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ✅ Get All Attendance Records
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await TeacherAttendance.find().populate('teacher_id', 'full_name');
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get Attendance by Teacher ID
exports.getAttendanceByTeacher = async (req, res) => {
    try {
        const records = await TeacherAttendance.find({ teacher_id: req.params.teacherId });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Update Attendance
exports.updateAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        const record = await TeacherAttendance.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        if (status) record.status = status;
        if (req.file) record.supportingDocument = req.file.path;

        await record.save();
        res.json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ✅ Delete Attendance
exports.deleteAttendance = async (req, res) => {
    try {
        const record = await TeacherAttendance.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        await record.deleteOne();
        res.json({ message: 'Attendance record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getTeacherMonthlyReport = async (req, res) => {
    const { teacherId, month, year } = req.query;

    const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    try {
        const records = await TeacherAttendance.find({
            teacher_id: teacherId,
            date: { $gte: startDate, $lte: endDate }
        });

        const summary = {
            present: records.filter(r => r.status === 'Present').length,
            absent: records.filter(r => r.status === 'Absent').length,
            leave: records.filter(r => r.status === 'Leave').length,
            totalDays: records.length,
        };

        res.json({ summary, records });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.exportTeacherAttendanceExcel = async (req, res) => {
    const { teacherId } = req.params;
    const records = await TeacherAttendance.find({ teacher_id: teacherId });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
        { header: 'Date', key: 'date' },
        { header: 'Status', key: 'status' },
        { header: 'Remarks', key: 'remarks' },
    ];

    records.forEach(r => {
        worksheet.addRow({
            date: r.date.toDateString(),
            status: r.status,
            remarks: r.supportingDocument ? "Has Document" : ""
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=teacher_attendance.xlsx');

    await workbook.xlsx.write(res);
    res.end();
};