// ExamModule.jsx
import React, { useState, useMemo } from 'react';
import {
  BarChart2, BookA, LayoutList, Edit,
  TrendingUp, TrendingDown, MinusCircle, PieChart, XCircle, GraduationCap, Settings
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import TotalMarksModal from './TotalMarksModal'; // Import the new modal component
import {
  teacherClasses,
  students as initialStudentsData, // Rename to avoid conflict with state
  getClassReportData,
  subjectsConfig as initialSubjectsConfig // Rename to avoid conflict with state
} from './ReportsData'; // Adjust path as needed

const ExamModule = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [activeReportClass, setActiveReportClass] = useState('Grade 5');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showTotalMarksModal, setShowTotalMarksModal] = useState(false); // New state for total marks modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tempMarks, setTempMarks] = useState({});
  
  // State for student data (can be updated for grade edits)
  const [studentData, setStudentData] = useState(initialStudentsData);
  // State for subject configuration (including max marks)
  const [currentSubjectsConfig, setCurrentSubjectsConfig] = useState(initialSubjectsConfig);

  // Dynamically create the exams array based on the currentSubjectsConfig state
  const currentExams = useMemo(() => {
    return Object.keys(currentSubjectsConfig).map((subject, index) => ({
      examId: `EXM${String(index + 1).padStart(3, '0')}`,
      examName: `Grade 5 ${subject} Exam`,
      class: 'Grade 5',
      subject: subject,
      maxMarks: currentSubjectsConfig[subject].maxMarks,
      status: 'Completed'
    }));
  }, [currentSubjectsConfig]);

  const currentClassReport = useMemo(() => {
    // Pass both studentData and currentSubjectsConfig to getClassReportData
    return getClassReportData(activeReportClass, studentData, currentSubjectsConfig);
  }, [activeReportClass, activeTab, studentData, currentSubjectsConfig]); // Add dependencies

  // Ensure initial activeReportClass is set if teacherClasses exists
  useMemo(() => {
    if (activeTab === 'reports' && !activeReportClass && teacherClasses.length > 0) {
      setActiveReportClass(teacherClasses[0]);
    }
  }, [activeTab, activeReportClass, teacherClasses]);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setTempMarks({ ...student.marks });
    setShowGradeModal(true);
  };

  const handleMarkChange = (subject, value) => {
    // Get max marks from the currentSubjectsConfig state
    const maxMarks = currentSubjectsConfig[subject]?.maxMarks;
    let numericValue = value !== '' ? parseInt(value) : '';

    // Ensure marks do not exceed maxMarks and are not negative
    if (numericValue !== '' && (numericValue < 0 || numericValue > maxMarks)) {
      alert(`Marks for ${subject} must be between 0 and ${maxMarks}.`);
      numericValue = numericValue < 0 ? 0 : maxMarks;
    }

    setTempMarks(prev => ({
      ...prev,
      [subject]: numericValue
    }));
  };

  const handleSaveGrades = (e) => {
    e.preventDefault();

    // Update the studentData state with the new marks
    setStudentData(prevStudents =>
      prevStudents.map(student =>
        student.id === selectedStudent.id
          ? { ...student, marks: { ...tempMarks } }
          : student
      )
    );

    console.log(`Updated marks for ${selectedStudent.name}:`, tempMarks);
    setShowGradeModal(false);
  };

  // --- Total Marks Modal Handlers ---
  const handleOpenTotalMarksModal = () => {
    setShowTotalMarksModal(true);
  };

  const handleCloseTotalMarksModal = () => {
    setShowTotalMarksModal(false);
  };

  const handleSaveMaxMarks = (newMaxMarks) => {
    const updatedConfig = { ...currentSubjectsConfig };
    for (const subject in newMaxMarks) {
      if (updatedConfig[subject]) {
        updatedConfig[subject].maxMarks = newMaxMarks[subject];
      } else {
        // If a new subject was somehow introduced, handle it
        updatedConfig[subject] = { maxMarks: newMaxMarks[subject] };
      }
    }
    setCurrentSubjectsConfig(updatedConfig);
    console.log("Updated Subjects Config (Max Marks):", updatedConfig);
    // In a real application, you would also persist this to a backend database.
  };
  // --- End Total Marks Modal Handlers ---

  const PIE_COLORS = ['#22C55E', '#EAB308', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-md">
          <p className="text-sm font-semibold">{`${payload[0].name}: ${payload[0].value} students`}</p>
          <p className="text-xs text-gray-600">{`Percentage: ${(payload[0].percent * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header and Tabs */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
    <LayoutList size={24} className="text-purple-600 sm:w-8 sm:h-8 w-6 h-6" />
    Grades & Reports
  </h1>
  
  <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
    {/* Set Exam Marks button - full width on mobile */}
    <button
      onClick={handleOpenTotalMarksModal}
      className="px-4 py-2 sm:px-5 sm:py-2 rounded-lg font-semibold transition-colors duration-200 bg-blue-500 text-white shadow-md hover:bg-blue-600 flex items-center gap-2 w-full sm:w-auto justify-center"
    >
      <Settings size={18} className="sm:w-5 sm:h-5 w-4 h-4" /> 
      <span>Set Exam Marks</span>
    </button>
    
    {/* Tab buttons - adjust to fit on mobile */}
    <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
      <button
        onClick={() => setActiveTab('grades')}
        className={`px-3 py-1 sm:px-5 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base ${
          activeTab === 'grades' 
            ? 'bg-purple-600 text-white shadow-md' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } flex-1 sm:flex-none`}
      >
        Student Grades
      </button>
      <button
        onClick={() => setActiveTab('reports')}
        className={`px-3 py-1 sm:px-5 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base ${
          activeTab === 'reports' 
            ? 'bg-purple-600 text-white shadow-md' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } flex-1 sm:flex-none`}
      >
        Class Reports
      </button>
    </div>
  </div>
</div>

        {/* Student Grades Tab Content */}
        {activeTab === 'grades' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Grade 5 Student Marks</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    {Object.keys(currentSubjectsConfig).map(subject => (
                      <th key={subject} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{subject}</th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentData.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                      {Object.keys(currentSubjectsConfig).map(subject => (
                        <td key={subject} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.marks[subject]}</td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          <Edit size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Reports Tab Content */}
        {activeTab === 'reports' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Class Performance Reports</h2>

            {activeReportClass && currentClassReport && (
              <div className="grid grid-cols-1 lg:grid-cols-[57%_43%] gap-8 mt-8">
                {/* Grade 5 Details - 60% width */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookA size={22} className="text-orange-600" /> {activeReportClass} Details
                  </h3>

                  {currentClassReport.sectionSummary.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Section Summary</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Performance (%)</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-green-600"><TrendingUp size={14} className="inline-block mr-1" />Good</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-yellow-600"><MinusCircle size={14} className="inline-block mr-1" />Average</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-red-600"><TrendingDown size={14} className="inline-block mr-1" />Poor</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentClassReport.sectionSummary.map((summary, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{summary.section}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{summary.studentsGraded} / {summary.totalStudents}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{summary.averagePercentage}%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{summary.good}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{summary.average}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{summary.poor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {currentClassReport.subjectPerformance.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Subject Performance</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-green-600"><TrendingUp size={14} className="inline-block mr-1" />Good</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-yellow-600"><MinusCircle size={14} className="inline-block mr-1" />Average</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-red-600"><TrendingDown size={14} className="inline-block mr-1" />Poor</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Graded</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentClassReport.subjectPerformance.map((subj, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{subj.subject}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{subj.good}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{subj.average}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{subj.poor}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{subj.totalGradedStudents}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overall Class Performance - 40% width */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <PieChart size={22} className="text-purple-600" /> Overall Performance ({activeReportClass})
                  </h3>
                  {currentClassReport.overallClassChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={currentClassReport.overallClassChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={(entry) => `${entry.name} (${entry.value})`}
                        >
                          {currentClassReport.overallClassChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-gray-500 py-10">
                      No overall performance data for this class yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Grade Edit Modal */}
        {showGradeModal && selectedStudent && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-auto">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
              <button
                onClick={() => setShowGradeModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <XCircle size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                <GraduationCap className="inline-block mr-2" size={24} />
                Edit Grades for {selectedStudent.name} ({selectedStudent.rollNo})
              </h2>
              <form onSubmit={handleSaveGrades}>
                <div className="overflow-y-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Scored</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Use currentExams to display subjects and max marks */}
                      {currentExams.map((exam) => (
                        <tr key={exam.examId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exam.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exam.maxMarks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="number"
                              value={tempMarks[exam.subject] || ''}
                              onChange={(e) => handleMarkChange(exam.subject, e.target.value)}
                              min="0"
                              max={exam.maxMarks}
                              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGradeModal(false)}
                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition transform hover:scale-105 shadow-md"
                  >
                    Save Grades
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Total Marks Modal */}
        {showTotalMarksModal && (
          <TotalMarksModal
            onClose={handleCloseTotalMarksModal}
            onSaveMarks={handleSaveMaxMarks}
            initialSubjectsConfig={currentSubjectsConfig} // Pass the current config for pre-filling inputs
          />
        )}
      </div>
  );
};

export default ExamModule;