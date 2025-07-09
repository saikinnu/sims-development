const Class = require('../../models/AcademicSchema/Class');

// 🆕 Create a new class
exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📚 Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('class_teacher_id', 'full_name');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get a class by ID
exports.getClassById = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id).populate('class_teacher_id', 'full_name');
    if (!classObj) return res.status(404).json({ message: 'Class not found' });
    res.json(classObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Update a class
exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Class not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ Delete a class
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
