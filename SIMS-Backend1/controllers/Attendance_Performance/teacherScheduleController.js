const TeacherSchedule = require('../../models/Attendance_PerformanceSchema/TeacherSchedule');

// Get all schedules for a teacher
exports.getSchedulesByTeacher = async (req, res) => {
  try {
    const schedules = await TeacherSchedule.find({ teacherId: req.params.teacherId });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const schedule = new TeacherSchedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await TeacherSchedule.findByIdAndUpdate(
      req.params.scheduleId,
      req.body,
      { new: true }
    );
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    await TeacherSchedule.findByIdAndDelete(req.params.scheduleId);
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all schedules (optionally filter by classId)
exports.getAllSchedules = async (req, res) => {
  try {
    const { classId } = req.query;
    let filter = {};
    if (classId) {
      filter.classId = classId;
    }
    const schedules = await TeacherSchedule.find(filter);
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 