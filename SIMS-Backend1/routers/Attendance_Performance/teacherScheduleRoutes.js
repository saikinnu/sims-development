const express = require('express');
const router = express.Router();
const teacherScheduleController = require('../../controllers/Attendance_Performance/teacherScheduleController');

// Get all schedules (optionally filter by classId)
router.get('/', teacherScheduleController.getAllSchedules);
// Get all schedules for a teacher
router.get('/:teacherId', teacherScheduleController.getSchedulesByTeacher);
// Create a new schedule
router.post('/', teacherScheduleController.createSchedule);
// Update a schedule
router.put('/:scheduleId', teacherScheduleController.updateSchedule);
// Delete a schedule
router.delete('/:scheduleId', teacherScheduleController.deleteSchedule);

module.exports = router; 