const HomeworkAssignment = require('../../models/Communication_Activities/HomeworkAssignment');

// ✅ Create Homework
exports.createHomework = async (req, res) => {
  try {
    const { subject_id, class_id, due_date, description } = req.body;

    const assignment = new HomeworkAssignment({
      subject_id,
      class_id,
      teacher_id: req.user._id,
      due_date,
      description,
      attachment_url: req.file?.path || '',
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get All Homework (optional filters)
exports.getAllHomework = async (req, res) => {
  try {
    const { class_id, subject_id } = req.query;

    const filter = {};
    if (class_id) filter.class_id = class_id;
    if (subject_id) filter.subject_id = subject_id;

    const homework = await HomeworkAssignment.find(filter)
      .populate('teacher_id', 'full_name')
      .populate('class_id', 'name')
      .populate('subject_id', 'name');

    res.json(homework);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Single Homework
exports.getHomeworkById = async (req, res) => {
  try {
    const assignment = await HomeworkAssignment.findById(req.params.id)
      .populate('teacher_id', 'full_name')
      .populate('class_id', 'name')
      .populate('subject_id', 'name');

    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Homework (only creator)
exports.updateHomework = async (req, res) => {
  try {
    const assignment = await HomeworkAssignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Not found' });
    if (assignment.teacher_id.toString() !== req.user._id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    const { due_date, description } = req.body;

    if (due_date) assignment.due_date = due_date;
    if (description) assignment.description = description;
    if (req.file) assignment.attachment_url = req.file.path;

    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete Homework (teacher who created or admin)
exports.deleteHomework = async (req, res) => {
  try {
    const assignment = await HomeworkAssignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Not found' });
    if (assignment.teacher_id.toString() !== req.user._id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    await assignment.deleteOne();
    res.json({ message: 'Homework deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
