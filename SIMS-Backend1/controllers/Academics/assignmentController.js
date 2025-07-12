const Assignment = require('../../models/AcademicSchema/Assignment');

// 📥 Create Assignment
exports.createAssignment = async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📚 Get All Assignments (Optional filter)
exports.getAllAssignments = async (req, res) => {
  try {
    // Populate 'class' and 'subject' fields if you want to see the full details
    // instead of just their IDs.
    const assignments = await Assignment.find()
      .populate("class", "class_name") // Assuming 'Class' model has a 'name' field
      .populate("subject", "name"); // Assuming 'Subject' model has a 'name' field

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📄 Get Single Assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("class", "class_name")
      .populate("subject", "name");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    console.error("Error fetching assignment by ID:", error);
    // Handle CastError for invalid IDs
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📝 Update Assignment (Teacher who created it or admin)
exports.updateAssignment = async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ❌ Delete Assignment (Teacher who created or Admin)
exports.deleteAssignment = async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
