// --- Constants for Grade Thresholds ---
export const GOOD_THRESHOLD = 80;    // Marks >= 80%
export const AVERAGE_THRESHOLD = 50; // Marks >= 50% and < 80%
export const POOR_THRESHOLD = 0;     // Marks < 50% (assuming marks can't be negative)

// --- Predefined Mock Data ---
// This data is simplified for demonstration. In a real application,
// this would likely be much larger or loaded from a JSON file/API.

const predefinedExams = [
  // Grade 1 Exams
  { examId: 'EXM0101', examName: 'Mathematics Test 1', class: 'Grade 1', subject: 'Mathematics', date: '2025-06-15', time: '10:00 AM', duration: 60, maxMarks: 100, status: 'Completed', roomNo: 'Room 101', examiner: 'Teacher Mat' },
  { examId: 'EXM0102', examName: 'Science Test 1', class: 'Grade 1', subject: 'Science', date: '2025-06-17', time: '10:00 AM', duration: 60, maxMarks: 100, status: 'Completed', roomNo: 'Room 102', examiner: 'Teacher Sci' },
  { examId: 'EXM0103', examName: 'English Test 1', class: 'Grade 1', subject: 'English', date: '2025-06-19', time: '10:00 AM', duration: 60, maxMarks: 100, status: 'Completed', roomNo: 'Room 103', examiner: 'Teacher Eng' },
  // Grade 2 Exams (simplified for brevity)
  { examId: 'EXM0201', examName: 'Mathematics Test 1', class: 'Grade 2', subject: 'Mathematics', date: '2025-06-16', time: '10:00 AM', duration: 60, maxMarks: 100, status: 'Completed', roomNo: 'Room 201', examiner: 'Teacher Mat' },
  { examId: 'EXM0202', examName: 'Science Test 1', class: 'Grade 2', subject: 'Science', date: '2025-06-18', time: '10:00 AM', duration: 60, maxMarks: 100, status: 'Completed', roomNo: 'Room 202', examiner: 'Teacher Sci' },
  { examId: 'EXM0203', examName: 'English Test 1', class: 'Grade 2', subject: 'English', date: '2025-06-20', time: '10:00 AM', duration: 60, maxMarks: 100, status: 'Completed', roomNo: 'Room 203', examiner: 'Teacher Eng' },
  // Add more exams for other grades as needed for comprehensive data
];

const predefinedStudents = [
  // Grade 1 Students - Now generating 10 students
  { id: 'S01001', name: 'Student 1-1', class: 'Grade 1', section: 'A', rollNo: '01A01' },
  { id: 'S01002', name: 'Student 1-2', class: 'Grade 1', section: 'A', rollNo: '01A02' },
  { id: 'S01003', name: 'Student 1-3', class: 'Grade 1', section: 'A', rollNo: '01A03' },
  { id: 'S01004', name: 'Student 1-4', class: 'Grade 1', section: 'A', rollNo: '01A04' },
  { id: 'S01005', name: 'Student 1-5', class: 'Grade 1', section: 'A', rollNo: '01A05' },
  { id: 'S01006', name: 'Student 1-6', class: 'Grade 1', section: 'B', rollNo: '01B01' },
  { id: 'S01007', name: 'Student 1-7', class: 'Grade 1', section: 'B', rollNo: '01B02' },
  { id: 'S01008', name: 'Student 1-8', class: 'Grade 1', section: 'B', rollNo: '01B03' },
  { id: 'S01009', name: 'Student 1-9', class: 'Grade 1', section: 'B', rollNo: '01B04' },
  { id: 'S01010', name: 'Student 1-10', class: 'Grade 1', section: 'B', rollNo: '01B05' },
  // Grade 2 Students - Now generating 10 students
  { id: 'S02001', name: 'Student 2-1', class: 'Grade 2', section: 'A', rollNo: '02A01' },
  { id: 'S02002', name: 'Student 2-2', class: 'Grade 2', section: 'A', rollNo: '02A02' },
  { id: 'S02003', name: 'Student 2-3', class: 'Grade 2', section: 'A', rollNo: '02A03' },
  { id: 'S02004', name: 'Student 2-4', class: 'Grade 2', section: 'A', rollNo: '02A04' },
  { id: 'S02005', name: 'Student 2-5', class: 'Grade 2', section: 'A', rollNo: '02A05' },
  { id: 'S02006', name: 'Student 2-6', class: 'Grade 2', section: 'B', rollNo: '02B01' },
  { id: 'S02007', name: 'Student 2-7', class: 'Grade 2', section: 'B', rollNo: '02B02' },
  { id: 'S02008', name: 'Student 2-8', class: 'Grade 2', section: 'B', rollNo: '02B03' },
  { id: 'S02009', name: 'Student 2-9', class: 'Grade 2', section: 'B', rollNo: '02B04' },
  { id: 'S02010', name: 'Student 2-10', class: 'Grade 2', section: 'B', rollNo: '02B05' },
];

const predefinedStudentGrades = [
  // Grades for Student 1-1 (Grade 1, Section A)
  { examId: 'EXM0101', studentId: 'S01001', marks: 85 }, // Math: Good
  { examId: 'EXM0102', studentId: 'S01001', marks: 70 }, // Science: Average
  { examId: 'EXM0103', studentId: 'S01001', marks: 92 }, // English: Good

  // Grades for Student 1-2 (Grade 1, Section A)
  { examId: 'EXM0101', studentId: 'S01002', marks: 45 }, // Math: Poor
  { examId: 'EXM0102', studentId: 'S01002', marks: 60 }, // Science: Average
  { examId: 'EXM0103', studentId: 'S01002', marks: 55 }, // English: Average

  // Grades for Student 1-3 (Grade 1, Section A)
  { examId: 'EXM0101', studentId: 'S01003', marks: 78 }, // Math: Average
  { examId: 'EXM0102', studentId: 'S01003', marks: 88 }, // Science: Good
  { examId: 'EXM0103', studentId: 'S01003', marks: 72 }, // English: Average

  // Grades for Student 1-4 (Grade 1, Section A)
  { examId: 'EXM0101', studentId: 'S01004', marks: 62 }, // Math: Average
  { examId: 'EXM0102', studentId: 'S01004', marks: 40 }, // Science: Poor
  { examId: 'EXM0103', studentId: 'S01004', marks: 81 }, // English: Good

  // Grades for Student 1-5 (Grade 1, Section A)
  { examId: 'EXM0101', studentId: 'S01005', marks: 95 }, // Math: Good
  { examId: 'EXM0102', studentId: 'S01005', marks: 89 }, // Science: Good
  { examId: 'EXM0103', studentId: 'S01005', marks: 91 }, // English: Good

  // Grades for Student 1-6 (Grade 1, Section B)
  { examId: 'EXM0101', studentId: 'S01006', marks: 30 }, // Math: Poor
  { examId: 'EXM0102', studentId: 'S01006', marks: 25 }, // Science: Poor
  { examId: 'EXM0103', studentId: 'S01006', marks: 48 }, // English: Poor

  // Grades for Student 1-7 (Grade 1, Section B)
  { examId: 'EXM0101', studentId: 'S01007', marks: 75 },
  { examId: 'EXM0102', studentId: 'S01007', marks: 82 },
  { examId: 'EXM0103', studentId: 'S01007', marks: 68 },

  // Grades for Student 1-8 (Grade 1, Section B)
  { examId: 'EXM0101', studentId: 'S01008', marks: 50 },
  { examId: 'EXM0102', studentId: 'S01008', marks: 35 },
  { examId: 'EXM0103', studentId: 'S01008', marks: 77 },

  // Grades for Student 1-9 (Grade 1, Section B)
  { examId: 'EXM0101', studentId: 'S01009', marks: 88 },
  { examId: 'EXM0102', studentId: 'S01009', marks: 91 },
  { examId: 'EXM0103', studentId: 'S01009', marks: 80 },

  // Grades for Student 1-10 (Grade 1, Section B)
  { examId: 'EXM0101', studentId: 'S01010', marks: 42 },
  { examId: 'EXM0102', studentId: 'S01010', marks: 65 },
  { examId: 'EXM0103', studentId: 'S01010', marks: 58 },

  // Grades for Student 2-1 (Grade 2, Section A)
  { examId: 'EXM0201', studentId: 'S02001', marks: 75 }, // Math: Average
  { examId: 'EXM0202', studentId: 'S02001', marks: 82 }, // Science: Good
  { examId: 'EXM0203', studentId: 'S02001', marks: 68 }, // English: Average

  // Grades for Student 2-2 (Grade 2, Section A)
  { examId: 'EXM0201', studentId: 'S02002', marks: 50 }, // Math: Average
  { examId: 'EXM0202', studentId: 'S02002', marks: 35 }, // Science: Poor
  { examId: 'EXM0203', studentId: 'S02002', marks: 77 }, // English: Average

  // Grades for Student 2-3 (Grade 2, Section A)
  { examId: 'EXM0201', studentId: 'S02003', marks: 88 }, // Math: Good
  { examId: 'EXM0202', studentId: 'S02003', marks: 91 }, // Science: Good
  { examId: 'EXM0203', studentId: 'S02003', marks: 80 }, // English: Good

  // Grades for Student 2-4 (Grade 2, Section A)
  { examId: 'EXM0201', studentId: 'S02004', marks: 42 }, // Math: Poor
  { examId: 'EXM0202', studentId: 'S02004', marks: 65 }, // Science: Average
  { examId: 'EXM0203', studentId: 'S02004', marks: 58 }, // English: Average

  // Grades for Student 2-5 (Grade 2, Section A)
  { examId: 'EXM0201', studentId: 'S02005', marks: 70 }, // Math: Average
  { examId: 'EXM0202', studentId: 'S02005', marks: 75 }, // Science: Average
  { examId: 'EXM0203', studentId: 'S02005', marks: 85 }, // English: Good

  // Grades for Student 2-6 (Grade 2, Section B)
  { examId: 'EXM0201', studentId: 'S02006', marks: 55 }, // Math: Average
  { examId: 'EXM0202', studentId: 'S02006', marks: 40 }, // Science: Poor
  { examId: 'EXM0203', studentId: 'S02006', marks: 60 }, // English: Average

  // Grades for Student 2-7 (Grade 2, Section B)
  { examId: 'EXM0201', studentId: 'S02007', marks: 90 },
  { examId: 'EXM0202', studentId: 'S02007', marks: 85 },
  { examId: 'EXM0203', studentId: 'S02007', marks: 92 },

  // Grades for Student 2-8 (Grade 2, Section B)
  { examId: 'EXM0201', studentId: 'S02008', marks: 65 },
  { examId: 'EXM0202', studentId: 'S02008', marks: 70 },
  { examId: 'EXM0203', studentId: 'S02008', marks: 75 },

  // Grades for Student 2-9 (Grade 2, Section B)
  { examId: 'EXM0201', studentId: 'S02009', marks: 30 },
  { examId: 'EXM0202', studentId: 'S02009', marks: 20 },
  { examId: 'EXM0203', studentId: 'S02009', marks: 40 },

  // Grades for Student 2-10 (Grade 2, Section B)
  { examId: 'EXM0201', studentId: 'S02010', marks: 80 },
  { examId: 'EXM0202', studentId: 'S02010', marks: 78 },
  { examId: 'EXM0203', studentId: 'S02010', marks: 88 },

  // Add more grades for other students and exams as needed
];

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Extend data for Grades 3 to 10
for (let grade = 3; grade <= 10; grade++) {
  const gradeStr = grade < 10 ? `0${grade}` : `${grade}`;
  let examDate = new Date('2025-07-01'); // Starting date for new exams

  // Generate Exams for the current grade
  const subjects = ['Mathematics', 'Science', 'English'];
  subjects.forEach((subject, index) => {
    examDate.setDate(examDate.getDate() + 2); // Increment date for next exam
    const examId = `EXM${gradeStr}0${index + 1}`;
    predefinedExams.push({
      examId: examId,
      examName: `${subject} Test 1`,
      class: `Grade ${grade}`,
      subject: subject,
      date: examDate.toISOString().slice(0, 10),
      time: '10:00 AM',
      duration: 60,
      maxMarks: 100,
      status: 'Completed',
      roomNo: `Room ${grade}0${index + 1}`,
      examiner: `Teacher ${subject.slice(0, 3)}`
    });
  });

  // Generate Students for the current grade (10 students per grade)
  for (let i = 1; i <= 10; i++) { // Changed limit to 10
    const studentId = `S${gradeStr}${i < 10 ? `00${i}` : `0${i}`}`; // Adjust ID for 10 students
    const section = i <= 5 ? 'A' : 'B'; // 5 students in Section A, 5 in Section B
    const rollNoSuffix = i <= 5 ? i : i - 5; // Roll number within section
    const rollNo = `${gradeStr}${section}${rollNoSuffix < 10 ? `0${rollNoSuffix}` : rollNoSuffix}`;

    predefinedStudents.push({
      id: studentId,
      name: `Student ${grade}-${i}`,
      class: `Grade ${grade}`,
      section: section,
      rollNo: rollNo
    });
  }

  // Generate Student Grades for the current grade
  const examsForGrade = predefinedExams.filter(exam => exam.class === `Grade ${grade}`);
  const studentsForGrade = predefinedStudents.filter(student => student.class === `Grade ${grade}`);

  studentsForGrade.forEach(student => {
    examsForGrade.forEach(exam => {
      predefinedStudentGrades.push({
        examId: exam.examId,
        studentId: student.id,
        marks: getRandomInt(20, 99) // Random marks between 20 and 99
      });
    });
  });
}

// --- Main function to provide predefined school data ---
export const generateSchoolData = () => {
  return {
    allGeneratedExams: predefinedExams,
    allGeneratedStudents: predefinedStudents,
    allGeneratedGrades: predefinedStudentGrades
  };
};

// Example of how to use the generated data (optional, for testing)
// const schoolData = generateSchoolData();
// console.log("All Exams:", schoolData.allGeneratedExams);
// console.log("All Students:", schoolData.allGeneratedStudents);
// console.log("All Grades:", schoolData.allGeneratedGrades);