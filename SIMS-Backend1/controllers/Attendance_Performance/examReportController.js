const Student = require('../../models/CoreUser/Student');
const Result = require('../../models/Attendance_PerformanceSchema/Result');
const Exam = require('../../models/Attendance_PerformanceSchema/Exam');
const Class = require('../../models/AcademicSchema/Class');
const fs = require('fs');
const path = require('path');
const SUBJECTS_CONFIG_PATH = path.join(__dirname, '../../data/subjectsConfig.json');

// GET /api/exam-reports/overview
// Returns: { exams: [...], students: [...], grades: [...] }
exports.getExamReportOverview = async (req, res) => {
  try {
    // Fetch all exams (add status, subject, class, maxMarks if available)
    const exams = await Exam.find({});

    // Fetch all students
    const students = await Student.find({});

    // Fetch all results (grades)
    const grades = await Result.find({});

    // Optionally, fetch class info for mapping class_id to class name/section
    const classes = await Class.find({});

    // Map class_id to class_name for students
    const classIdToName = {};
    classes.forEach(cls => {
      classIdToName[cls._id?.toString() || cls.class_id] = cls.class_name || cls.grade;
    });

    // Format students for frontend (id, class, section, ...)
    const formattedStudents = students.map(stu => ({
      id: stu.user_id,
      name: stu.full_name,
      class: classIdToName[stu.class_id] || stu.class_id || '',
      section: stu.section || '',
      rollNo: stu.rollNo || stu.admission_number || '',
      ...stu._doc
    }));

    // Format exams for frontend (examId, class, subject, status, maxMarks, ...)
    const formattedExams = exams.map(exam => ({
      examId: exam.exam_id,
      examName: exam.exam_name,
      class: exam.class || '',
      subject: exam.subject || '',
      status: exam.status || 'Completed', // Default to Completed if not present
      maxMarks: exam.maxMarks || 100, // Default if not present
      ...exam._doc
    }));

    // Format grades for frontend (studentId, examId, marks, ...)
    const formattedGrades = grades.flatMap(result => {
      // result.marks is an object: { subject: marks, ... }
      return Object.entries(result.marks || {}).map(([subject, marks]) => ({
        studentId: result.id,
        subject,
        marks,
        // examId: ??? (if available, else null)
      }));
    });

    res.json({
      exams: formattedExams,
      students: formattedStudents,
      grades: formattedGrades
    });
  } catch (err) {
    console.error('Error in getExamReportOverview:', err);
    res.status(500).json({ error: 'Failed to fetch exam report data.' });
  }
};

// --- Static subjects config for results frontend integration ---
let subjectsConfig = {
  'Mathematics': { maxMarks: 100, passingMarks: 35 },
  'Science': { maxMarks: 80, passingMarks: 28 },
  'Social Studies': { maxMarks: 50, passingMarks: 18 },
  'English': { maxMarks: 70, passingMarks: 25 },
  'Computer Science': { maxMarks: 60, passingMarks: 21 },
};

// Load from file if exists
try {
  if (fs.existsSync(SUBJECTS_CONFIG_PATH)) {
    const fileData = fs.readFileSync(SUBJECTS_CONFIG_PATH, 'utf-8');
    subjectsConfig = JSON.parse(fileData);
  }
} catch (err) {
  console.error('Failed to load subjectsConfig from file:', err);
}

// GET /api/exam-reports/subjects-config
exports.getSubjectsConfig = (req, res) => {
  res.json(subjectsConfig);
};

// PUT /api/exam-reports/subjects-config
exports.updateSubjectsConfig = (req, res) => {
  const newConfig = req.body;
  if (!newConfig || typeof newConfig !== 'object') {
    return res.status(400).json({ error: 'Invalid config data' });
  }
  subjectsConfig = newConfig;
  // Persist to file
  try {
    fs.writeFileSync(SUBJECTS_CONFIG_PATH, JSON.stringify(subjectsConfig, null, 2), 'utf-8');
    res.json(subjectsConfig);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save config' });
  }
};

// GET /api/exam-reports/results
// Optional query params: class, section, search, gradeCategory
exports.getAllResults = async (req, res) => {
  try {
    const { class: classFilter, section, search, gradeCategory } = req.query;
    let query = {};
    if (classFilter) query.class = classFilter;
    if (section) query.section = section;
    // We'll filter by search and gradeCategory after fetching

    let results = await Result.find(query);

    // Calculate total, percentage, and gradeCategory for each student
    results = results.map(student => {
      let totalMarksObtained = 0;
      let totalMaxMarks = 0;
      let subjectsAttempted = 0;
      Object.entries(student.marks).forEach(([subject, marks]) => {
        const subjectConf = subjectsConfig[subject];
        if (subjectConf) {
          totalMarksObtained += marks;
          totalMaxMarks += subjectConf.maxMarks;
          subjectsAttempted++;
        }
      });
      const overallPercentage = subjectsAttempted > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
      // Grade category logic (match frontend)
      let gradeCat = 'Poor';
      if (overallPercentage >= 85) gradeCat = 'Excellent';
      else if (overallPercentage >= 70) gradeCat = 'Good';
      else if (overallPercentage >= 50) gradeCat = 'Average';
      return {
        ...student._doc,
        totalMarksObtained,
        totalMaxMarks,
        overallPercentage: parseFloat(overallPercentage.toFixed(2)),
        gradeCategory: gradeCat
      };
    });

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(student =>
        student.name.toLowerCase().includes(searchLower) ||
        student.rollNo.toLowerCase().includes(searchLower) ||
        student.id.toLowerCase().includes(searchLower)
      );
    }
    // Filter by gradeCategory
    if (gradeCategory) {
      results = results.filter(student => student.gradeCategory === gradeCategory);
    }

    res.json(results);
  } catch (err) {
    console.error('Error in getAllResults:', err);
    res.status(500).json({ error: 'Failed to fetch results.' });
  }
};