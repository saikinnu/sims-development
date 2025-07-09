// ReportsData.jsx
export const GOOD_THRESHOLD = 80;
export const AVERAGE_THRESHOLD = 50;
export const EXCELLENT_THRESHOLD = 90;
export const FAIL_THRESHOLD = 30;

export const allClasses = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
                          'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
export const allSections = ['A', 'B', 'C'];

export const subjectsConfig = {
  'Science': { maxMarks: 80, passingMarks: 24 },
  'Social Studies': { maxMarks: 50, passingMarks: 15 },
  'Mathematics': { maxMarks: 100, passingMarks: 30 },
  'English': { maxMarks: 70, passingMarks: 21 },
  'Computer Science': { maxMarks: 60, passingMarks: 18 }
};

export const students = [
  // 7 Excellent Students (90-100%)
  {
    id: 'G10E001', name: 'Alex Johnson', class: 'Grade 10', section: 'A', rollNo: '10A01',
    marks: { 'Science': 78, 'Social Studies': 49, 'Mathematics': 100, 'English': 70, 'Computer Science': 60 } // 91.4%
  },
  {
    id: 'G09E002', name: 'Bianca Smith', class: 'Grade 9', section: 'B', rollNo: '09B02',
    marks: { 'Science': 80, 'Social Studies': 50, 'Mathematics': 98, 'English': 68, 'Computer Science': 59 } // 91.1%
  },
  {
    id: 'G08E003', name: 'Carlos Mendez', class: 'Grade 8', section: 'C', rollNo: '08C03',
    marks: { 'Science': 79, 'Social Studies': 48, 'Mathematics': 97, 'English': 69, 'Computer Science': 58 } // 90.3%
  },
  {
    id: 'G07E004', name: 'Diana Chen', class: 'Grade 7', section: 'A', rollNo: '07A04',
    marks: { 'Science': 77, 'Social Studies': 49, 'Mathematics': 99, 'English': 70, 'Computer Science': 60 } // 91.7%
  },
  {
    id: 'G06E005', name: 'Ethan Wilson', class: 'Grade 6', section: 'B', rollNo: '06B05',
    marks: { 'Science': 80, 'Social Studies': 50, 'Mathematics': 96, 'English': 67, 'Computer Science': 59 } // 90.0%
  },
  {
    id: 'G05E006', name: 'Fiona Kim', class: 'Grade 5', section: 'C', rollNo: '05C06',
    marks: { 'Science': 76, 'Social Studies': 48, 'Mathematics': 100, 'English': 70, 'Computer Science': 60 } // 91.4%
  },
  {
    id: 'G04E007', name: 'George Brown', class: 'Grade 4', section: 'A', rollNo: '04A07',
    marks: { 'Science': 79, 'Social Studies': 47, 'Mathematics': 98, 'English': 69, 'Computer Science': 58 } // 90.6%
  },

  // 18 Good Students (80-89%)
  {
    id: 'G10G008', name: 'Hannah Lee', class: 'Grade 10', section: 'B', rollNo: '10B08',
    marks: { 'Science': 75, 'Social Studies': 45, 'Mathematics': 88, 'English': 62, 'Computer Science': 54 } // 84.4%
  },
  {
    id: 'G09G009', name: 'Ian Patel', class: 'Grade 9', section: 'C', rollNo: '09C09',
    marks: { 'Science': 72, 'Social Studies': 44, 'Mathematics': 85, 'English': 60, 'Computer Science': 52 } // 82.2%
  },
  {
    id: 'G08G010', name: 'Julia Garcia', class: 'Grade 8', section: 'A', rollNo: '08A10',
    marks: { 'Science': 70, 'Social Studies': 43, 'Mathematics': 82, 'English': 58, 'Computer Science': 50 } // 80.0%
  },
  {
    id: 'G07G011', name: 'Kevin Zhang', class: 'Grade 7', section: 'B', rollNo: '07B11',
    marks: { 'Science': 74, 'Social Studies': 45, 'Mathematics': 84, 'English': 61, 'Computer Science': 53 } // 83.3%
  },
  {
    id: 'G06G012', name: 'Lily Wilson', class: 'Grade 6', section: 'C', rollNo: '06C12',
    marks: { 'Science': 73, 'Social Studies': 44, 'Mathematics': 83, 'English': 59, 'Computer Science': 51 } // 81.7%
  },
  {
    id: 'G05G013', name: 'Mike Davis', class: 'Grade 5', section: 'A', rollNo: '05A13',
    marks: { 'Science': 71, 'Social Studies': 42, 'Mathematics': 81, 'English': 57, 'Computer Science': 49 } // 79.4%
  },
  {
    id: 'G04G014', name: 'Nina Rodriguez', class: 'Grade 4', section: 'B', rollNo: '04B14',
    marks: { 'Science': 76, 'Social Studies': 46, 'Mathematics': 86, 'English': 63, 'Computer Science': 55 } // 85.0%
  },
  {
    id: 'G03G015', name: 'Oscar Martinez', class: 'Grade 3', section: 'C', rollNo: '03C15',
    marks: { 'Science': 75, 'Social Studies': 45, 'Mathematics': 85, 'English': 62, 'Computer Science': 54 } // 84.4%
  },
  {
    id: 'G02G016', name: 'Priya Sharma', class: 'Grade 2', section: 'A', rollNo: '02A16',
    marks: { 'Science': 74, 'Social Studies': 44, 'Mathematics': 84, 'English': 61, 'Computer Science': 53 } // 83.3%
  },
  {
    id: 'G01G017', name: 'Quinn Taylor', class: 'Grade 1', section: 'B', rollNo: '01B17',
    marks: { 'Science': 73, 'Social Studies': 43, 'Mathematics': 83, 'English': 60, 'Computer Science': 52 } // 82.2%
  },
  {
    id: 'G10G018', name: 'Ryan Kim', class: 'Grade 10', section: 'C', rollNo: '10C18',
    marks: { 'Science': 72, 'Social Studies': 42, 'Mathematics': 82, 'English': 59, 'Computer Science': 51 } // 81.1%
  },
  {
    id: 'G09G019', name: 'Sophia Chen', class: 'Grade 9', section: 'A', rollNo: '09A19',
    marks: { 'Science': 71, 'Social Studies': 41, 'Mathematics': 81, 'English': 58, 'Computer Science': 50 } // 80.0%
  },
  {
    id: 'G08G020', name: 'Thomas Brown', class: 'Grade 8', section: 'B', rollNo: '08B20',
    marks: { 'Science': 77, 'Social Studies': 47, 'Mathematics': 87, 'English': 64, 'Computer Science': 56 } // 86.1%
  },
  {
    id: 'G07G021', name: 'Uma Patel', class: 'Grade 7', section: 'C', rollNo: '07C21',
    marks: { 'Science': 76, 'Social Studies': 46, 'Mathematics': 86, 'English': 63, 'Computer Science': 55 } // 85.0%
  },
  {
    id: 'G06G022', name: 'Victor Lee', class: 'Grade 6', section: 'A', rollNo: '06A22',
    marks: { 'Science': 75, 'Social Studies': 45, 'Mathematics': 85, 'English': 62, 'Computer Science': 54 } // 84.4%
  },
  {
    id: 'G05G023', name: 'Wendy Wilson', class: 'Grade 5', section: 'B', rollNo: '05B23',
    marks: { 'Science': 74, 'Social Studies': 44, 'Mathematics': 84, 'English': 61, 'Computer Science': 53 } // 83.3%
  },
  {
    id: 'G04G024', name: 'Xavier Garcia', class: 'Grade 4', section: 'C', rollNo: '04C24',
    marks: { 'Science': 73, 'Social Studies': 43, 'Mathematics': 83, 'English': 60, 'Computer Science': 52 } // 82.2%
  },
  {
    id: 'G03G025', name: 'Yara Smith', class: 'Grade 3', section: 'A', rollNo: '03A25',
    marks: { 'Science': 72, 'Social Studies': 42, 'Mathematics': 82, 'English': 59, 'Computer Science': 51 } // 81.1%
  },

  // 53 Average Students (50-79%) - Showing first 5 as example
  {
    id: 'G10A026', name: 'Zane Johnson', class: 'Grade 10', section: 'B', rollNo: '10B26',
    marks: { 'Science': 65, 'Social Studies': 40, 'Mathematics': 75, 'English': 55, 'Computer Science': 45 } // 72.2%
  },
  {
    id: 'G09A027', name: 'Amy Davis', class: 'Grade 9', section: 'C', rollNo: '09C27',
    marks: { 'Science': 60, 'Social Studies': 35, 'Mathematics': 70, 'English': 50, 'Computer Science': 40 } // 66.7%
  },
  // ... (48 more average students with percentages between 50-79%)
  {
    id: 'G01A079', name: 'Ben Wilson', class: 'Grade 1', section: 'C', rollNo: '01C79',
    marks: { 'Science': 55, 'Social Studies': 30, 'Mathematics': 65, 'English': 45, 'Computer Science': 35 } // 61.1%
  },

  // 22 Poor Students (0-49%) - Showing first 5 as example
  {
    id: 'G10P080', name: 'Chloe Brown', class: 'Grade 10', section: 'A', rollNo: '10A80',
    marks: { 'Science': 40, 'Social Studies': 25, 'Mathematics': 45, 'English': 30, 'Computer Science': 20 } // 44.4%
  },
  {
    id: 'G09P081', name: 'Daniel Kim', class: 'Grade 9', section: 'B', rollNo: '09B81',
    marks: { 'Science': 35, 'Social Studies': 20, 'Mathematics': 40, 'English': 25, 'Computer Science': 15 } // 38.3%
  },
  // ... (17 more poor students with percentages below 50%)
  {
    id: 'G01P100', name: 'Eva Martinez', class: 'Grade 1', section: 'C', rollNo: '01C100',
    marks: { 'Science': 30, 'Social Studies': 15, 'Mathematics': 35, 'English': 20, 'Computer Science': 10 } // 33.3%
  }
];

export const getStudentGradeCategory = (percentage) => {
  if (percentage >= EXCELLENT_THRESHOLD) {
    return 'Excellent';
  } else if (percentage >= GOOD_THRESHOLD) {
    return 'Good';
  } else if (percentage >= AVERAGE_THRESHOLD) {
    return 'Average';
  } else {
    return 'Poor';
  }
};