const AssignmentSubmission = require('../../models/AcademicSchema/AssignmentSubmission');
const Student = require('../../models/CoreUser/Student');
const { sendEmail } = require('../../utils/email');
const { sendSMS } = require('../../utils/sms');
const ExcelJS = require('exceljs');

exports.submitAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.body;

    const newSubmission = new AssignmentSubmission({
      assignment_id,
      student_id: req.user._id,
      file: {
        public_id: req.file.filename,
        url: req.file.path,
      }
    });

    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ assignment_id: req.params.assignmentId })
      .populate('student_id', 'full_name');

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, remarks } = req.body;

    const submission = await AssignmentSubmission.findById(req.params.id).populate('student_id');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = grade;
    submission.remarks = remarks;
    await submission.save();

    // Notify student
    const student = submission.student_id;
    const message = `📘 Your assignment has been graded.\nGrade: ${grade}\nRemarks: ${remarks || 'N/A'}`;

    if (student.email) {
      await sendEmail({
        to: student.email,
        subject: 'Assignment Graded',
        text: message,
      });
    }

    if (student.phone) {
      await sendSMS(student.phone, message);
    }

    res.json({ message: 'Graded and student notified', submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.exportGradesToExcel = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await AssignmentSubmission.find({ assignment_id: assignmentId })
      .populate('student_id', 'full_name email');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Assignment Grades');

    // Headers
    sheet.columns = [
      { header: 'Student Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Grade', key: 'grade', width: 10 },
      { header: 'Remarks', key: 'remarks', width: 40 },
      { header: 'Submitted At', key: 'submitted', width: 20 },
    ];

    submissions.forEach((sub) => {
      sheet.addRow({
        name: sub.student_id.full_name,
        email: sub.student_id.email,
        grade: sub.grade || 'N/A',
        remarks: sub.remarks || '',
        submitted: sub.submitted_at.toLocaleString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="grades_${assignmentId}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to export grades', error: error.message });
  }
};

