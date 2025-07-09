const Assignment = require('../../models/AcademicSchema/Assignment');

// 📥 Create Assignment
exports.createAssignment = async (req, res) => {
  try {
    const { subject_id, class_id, academic_term } = req.body;

    const newAssignment = new Assignment({
      teacher_id: req.user._id,
      subject_id,
      class_id,
      academic_term,
      cloudinary_file: req.file
        ? { public_id: req.file.filename, url: req.file.path }
        : {},
    });

    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📚 Get All Assignments (Optional filter)
exports.getAllAssignments = async (req, res) => {
  try {
    const { class_id, subject_id, academic_term } = req.query;
    const filter = {};
    if (class_id) filter.class_id = class_id;
    if (subject_id) filter.subject_id = subject_id;
    if (academic_term) filter.academic_term = academic_term;

    const assignments = await Assignment.find(filter)
      .populate('teacher_id', 'full_name')
      .populate('subject_id', 'name')
      .populate('class_id', 'name');

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get Single Assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher_id', 'full_name')
      .populate('subject_id', 'name')
      .populate('class_id', 'name');

    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Update Assignment (Teacher who created it or admin)
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });

    if (
      assignment.teacher_id.toString() !== req.user._id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { academic_term } = req.body;
    if (academic_term) assignment.academic_term = academic_term;

    if (req.file) {
      assignment.cloudinary_file = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ Delete Assignment (Teacher who created or Admin)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });

    if (
      assignment.teacher_id.toString() !== req.user._id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
