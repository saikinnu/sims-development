const Class = require('../../models/AcademicSchema/Class');

// Create a new class
exports.createClass = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.class_name || !req.body.strength) {
      return res.status(400).json({
        message: 'Class name and strength are required'
      });
    }

    // Format teachers_details subjects if provided as string
    const formattedTeachersDetails = req.body.teachers_details?.map(teacher => ({
      ...teacher,
      subjects: Array.isArray(teacher.subjects) ? 
        teacher.subjects : 
        (teacher.subjects?.split(',').map(s => s.trim()).filter(Boolean) || [])
    })) || [];

    // Create new class
    const newClass = new Class({
      class_name: req.body.class_name,
      strength: req.body.strength,
      grade: req.body.grade,
      supervisor: req.body.supervisor,
      teachers_details: formattedTeachersDetails
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Class name must be unique' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Get all classes with optional filtering
exports.getAllClasses = async (req, res) => {
  try {
    // Build filter object based on query params
    const filter = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.search) {
      filter.$or = [
        { class_name: { $regex: req.query.search, $options: 'i' } },
        { supervisor: { $regex: req.query.search, $options: 'i' } },
        { 'teachers_details.name': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const classes = await Class.find(filter).sort({ class_name: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single class by ID
exports.getClassById = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a class
exports.updateClass = async (req, res) => {
  try {
    // Format teachers_details subjects if provided
    const formattedTeachersDetails = req.body.teachers_details?.map(teacher => ({
      ...teacher,
      subjects: Array.isArray(teacher.subjects) ? 
        teacher.subjects : 
        (teacher.subjects?.split(',').map(s => s.trim()).filter(Boolean) || [])
    })) || [];

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      {
        class_name: req.body.class_name,
        strength: req.body.strength,
        grade: req.body.grade,
        supervisor: req.body.supervisor,
        teachers_details: formattedTeachersDetails
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Class name must be unique' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Delete a class
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get classes by grade level
exports.getClassesByGrade = async (req, res) => {
  try {
    const classes = await Class.find({ grade: req.params.grade })
      .sort({ class_name: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get classes with teachers teaching specific subjects
exports.getClassesBySubject = async (req, res) => {
  try {
    const subject = req.params.subject.toLowerCase();
    const classes = await Class.find({
      'teachers_details.subjects': {
        $elemMatch: { $regex: subject, $options: 'i' }
      }
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};