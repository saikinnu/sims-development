const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/Examination_Scheduling/examScheduleController');
const { protect, checkRole } = require('../../middlewares/authMiddleware');

router.post('/', protect, checkRole('admin', 'superadmin'), ctrl.createSchedule);
router.get('/:classId', protect, checkRole('admin', 'teacher', 'student', 'parent'), ctrl.getClassSchedule);

module.exports = router;
