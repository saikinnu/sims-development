const mongoose = require("mongoose");
const ResultSchema = new mongoose.Schema({
  // Unique identifier for the student, often used as the primary key
  id: {
    type: String,
    required: true,
    unique: true,
    // Example: 'G10E001'
  },
  // Full name of the student
  name: {
    type: String,
    required: true,
    // Example: 'Alex Johnson'
  },
  // Class of the student (e.g., 'Grade 10')
  class: {
    type: String,
    required: true,
    enum: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
           'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
    // Example: 'Grade 10'
  },
  // Section of the student (e.g., 'A', 'B', 'C')
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C'],
    // Example: 'A'
  },
  // Roll number of the student within their class and section
  rollNo: {
    type: String,
    required: true,
    // Example: '10A01'
  },
  // Object containing marks for each subject
  marks: {
    type: Object,
    required: true,
    // Keys are subject names, values are the marks obtained
    // Example:
    // {
    //   'Science': {
    //     type: Number,
    //     min: 0,
    //     max: 80 // Based on subjectsConfig.Science.maxMarks
    //   },
    //   'Social Studies': {
    //     type: Number,
    //     min: 0,
    //     max: 50 // Based on subjectsConfig.Social Studies.maxMarks
    //   },
    //   'Mathematics': {
    //     type: Number,
    //     min: 0,
    //     max: 100 // Based on subjectsConfig.Mathematics.maxMarks
    //   },
    //   'English': {
    //     type: Number,
    //     min: 0,
    //     max: 70 // Based on subjectsConfig.English.maxMarks
    //   },
    //   'Computer Science': {
    //     type: Number,
    //     min: 0,
    //     max: 60 // Based on subjectsConfig.Computer Science.maxMarks
    //   }
    // }
    // Example data: { 'Science': 78, 'Social Studies': 49, 'Mathematics': 100, 'English': 70, 'Computer Science': 60 }
  },
  // Optional: Fields that can be calculated on the fly or stored for convenience
  // totalMarksObtained: {
  //   type: Number,
  //   min: 0
  // },
  // totalMaxMarks: {
  //   type: Number,
  //   min: 0
  // },
  // overallPercentage: {
  //   type: Number,
  //   min: 0,
  //   max: 100
  // },
  // gradeCategory: {
  //   type: String,
  //   enum: ['Excellent', 'Good', 'Average', 'Poor']
  // }
},
{ timestamps: true }
)
module.exports = mongoose.model("Result", ResultSchema);
