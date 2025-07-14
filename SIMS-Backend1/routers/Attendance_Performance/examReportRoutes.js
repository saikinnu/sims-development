const express = require('express');
const router = express.Router();
const examReportController = require('../../controllers/Attendance_Performance/examReportController');

// GET /api/exam-reports/overview
router.get('/overview', examReportController.getExamReportOverview);

// GET /api/exam-reports/results
router.get('/results', examReportController.getAllResults);

// GET /api/exam-reports/subjects-config
router.get('/subjects-config', examReportController.getSubjectsConfig);
// PUT /api/exam-reports/subjects-config
router.put('/subjects-config', examReportController.updateSubjectsConfig);

module.exports = router;
