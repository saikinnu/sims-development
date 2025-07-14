// ExamModule.jsx
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart2, BookA, LayoutList, Edit,
  TrendingUp, TrendingDown, MinusCircle, PieChart, XCircle, GraduationCap, Settings
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import TotalMarksModal from './TotalMarksModal';

// Remove hardcoded imports
// import {
//   teacherClasses,
//   students as initialStudentsData, // Rename to avoid conflict with state
//   getClassReportData,
//   subjectsConfig as initialSubjectsConfig // Rename to avoid conflict with state
// } from './ReportsData';

const API_BASE = 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('authToken'));
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ExamModule = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [activeReportClass, setActiveReportClass] = useState('Grade 5');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showTotalMarksModal, setShowTotalMarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tempMarks, setTempMarks] = useState({});

  // Backend data states
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, subjectsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/exam-reports/overview`, { headers: getAuthHeaders() }),
          axios.get(`${API_BASE}/api/subjects`, { headers: getAuthHeaders() })
        ]);
        setStudents(overviewRes.data.students || []);
        setExams(overviewRes.data.exams || []);
        setGrades(overviewRes.data.grades || []);
        setSubjects(subjectsRes.data || []);
        // Set default class if available
        if (overviewRes.data.students && overviewRes.data.students.length > 0) {
          setActiveReportClass(overviewRes.data.students[0].class || 'Grade 5');
        }
      } catch (err) {
        setError('Failed to fetch exam data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build subjectsConfig from subjects array
  const subjectsConfig = useMemo(() => {
    const config = {};
    subjects.forEach(subj => {
      config[subj.name] = { maxMarks: subj.maxMarks, passingMarks: subj.passingMarks, _id: subj._id };
    });
    return config;
  }, [subjects]);

  // Helper: get students for current class
  const studentData = useMemo(() => {
    return students.filter(s => s.class === activeReportClass);
  }, [students, activeReportClass]);

  // Helper: get subjects config for current class (assuming all classes share config)
  const currentSubjectsConfig = subjectsConfig;

  // Helper: get exams for current class
  const currentExams = useMemo(() => {
    return exams.filter(e => e.class === activeReportClass);
  }, [exams, activeReportClass]);

  // Helper: get marks for a student (by studentId)
  const getStudentMarks = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    // Convert to { subject: marks, ... }
    const marks = {};
    studentGrades.forEach(g => {
      marks[g.subject] = g.marks;
    });
    return marks;
  };

  // Helper: getClassReportData (mimic previous logic, but from backend data)
  const getClassReportData = (className) => {
    // Section summary: group by section
    const classStudents = students.filter(s => s.class === className);
    const sections = [...new Set(classStudents.map(s => s.section))];
    const sectionSummary = sections.map(section => {
      const sectionStudents = classStudents.filter(s => s.section === section);
      const studentsGraded = sectionStudents.filter(s => grades.some(g => g.studentId === s.id)).length;
      const totalStudents = sectionStudents.length;
      // Calculate average performance
      let totalPercent = 0;
      let count = 0;
      sectionStudents.forEach(s => {
        const studentGrades = grades.filter(g => g.studentId === s.id);
        let total = 0, max = 0;
        studentGrades.forEach(g => {
          const conf = subjectsConfig[g.subject];
          if (conf) {
            total += g.marks;
            max += conf.maxMarks;
          }
        });
        if (max > 0) {
          totalPercent += (total / max) * 100;
          count++;
        }
      });
      const averagePercentage = count > 0 ? (totalPercent / count).toFixed(2) : 0;
      // Count grade categories
      let good = 0, average = 0, poor = 0;
      sectionStudents.forEach(s => {
        const studentGrades = grades.filter(g => g.studentId === s.id);
        let total = 0, max = 0;
        studentGrades.forEach(g => {
          const conf = subjectsConfig[g.subject];
          if (conf) {
            total += g.marks;
            max += conf.maxMarks;
          }
        });
        const percent = max > 0 ? (total / max) * 100 : 0;
        if (percent >= 70) good++;
        else if (percent >= 50) average++;
        else poor++;
      });
      return {
        section,
        studentsGraded,
        totalStudents,
        averagePercentage,
        good,
        average,
        poor
      };
    });
    // Subject performance
    const subjectPerformance = Object.keys(subjectsConfig).map(subject => {
      let good = 0, average = 0, poor = 0, totalGradedStudents = 0;
      classStudents.forEach(s => {
        const mark = grades.find(g => g.studentId === s.id && g.subject === subject);
        if (mark) {
          totalGradedStudents++;
          const percent = (mark.marks / (subjectsConfig[subject]?.maxMarks || 1)) * 100;
          if (percent >= 70) good++;
          else if (percent >= 50) average++;
          else poor++;
        }
      });
      return { subject, good, average, poor, totalGradedStudents };
    });
    // Overall class chart data
    let excellent = 0, good = 0, average = 0, poor = 0;
    classStudents.forEach(s => {
      const studentGrades = grades.filter(g => g.studentId === s.id);
      let total = 0, max = 0;
      studentGrades.forEach(g => {
        const conf = subjectsConfig[g.subject];
        if (conf) {
          total += g.marks;
          max += conf.maxMarks;
        }
      });
      const percent = max > 0 ? (total / max) * 100 : 0;
      if (percent >= 85) excellent++;
      else if (percent >= 70) good++;
      else if (percent >= 50) average++;
      else poor++;
    });
    const overallClassChartData = [
      { name: 'Excellent', value: excellent, color: '#22C55E' },
      { name: 'Good', value: good, color: '#3B82F6' },
      { name: 'Average', value: average, color: '#EAB308' },
      { name: 'Poor', value: poor, color: '#EF4444' }
    ];
    return { sectionSummary, subjectPerformance, overallClassChartData };
  };

  // --- Modal Handlers ---
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setTempMarks(getStudentMarks(student.id));
    setShowGradeModal(true);
  };

  const handleMarkChange = (subject, value) => {
    const maxMarks = currentSubjectsConfig[subject]?.maxMarks;
    let numericValue = value !== '' ? parseInt(value) : '';
    if (numericValue !== '' && (numericValue < 0 || numericValue > maxMarks)) {
      alert(`Marks for ${subject} must be between 0 and ${maxMarks}.`);
      numericValue = numericValue < 0 ? 0 : maxMarks;
    }
    setTempMarks(prev => ({ ...prev, [subject]: numericValue }));
  };

  const handleSaveGrades = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await Promise.all(Object.keys(tempMarks).map(async (subject) => {
        const exam = currentExams.find(e => e.subject === subject);
        if (!exam) return;
        // Try to update first, if not found, then POST
        try {
          await axios.put(`${API_BASE}/api/student-marks/update`, {
            student_id: selectedStudent.id,
            exam_id: exam.examId,
            subject_id: subject,
            marks_obtained: tempMarks[subject],
            max_marks: currentSubjectsConfig[subject].maxMarks
          }, { headers: getAuthHeaders() });
        } catch (err) {
          // If not found, create new
          await axios.post(`${API_BASE}/api/student-marks/`, {
            student_id: selectedStudent.id,
            exam_id: exam.examId,
            subject_id: subject,
            marks_obtained: tempMarks[subject],
            max_marks: currentSubjectsConfig[subject].maxMarks
          }, { headers: getAuthHeaders() });
        }
      }));
      // Refetch grades
      const overviewRes = await axios.get(`${API_BASE}/api/exam-reports/overview`, { headers: getAuthHeaders() });
      setGrades(overviewRes.data.grades || []);
      setShowGradeModal(false);
    } catch (err) {
      alert('Failed to save grades.');
    }
  };

  // --- Total Marks Modal Handlers ---
  const handleOpenTotalMarksModal = () => {
    setShowTotalMarksModal(true);
  };
  const handleCloseTotalMarksModal = () => {
    setShowTotalMarksModal(false);
  };
  const handleSaveMaxMarks = async (newMaxMarks) => {
    try {
      // For each subject, if maxMarks changed, update via PUT
      await Promise.all(Object.keys(newMaxMarks).map(async (subjectName) => {
        const subj = subjects.find(s => s.name === subjectName);
        if (subj && subj.maxMarks !== newMaxMarks[subjectName]) {
          await axios.put(`${API_BASE}/api/subjects/${subj._id}`, { maxMarks: newMaxMarks[subjectName] }, { headers: getAuthHeaders() });
        }
      }));
      // Refetch subjects
      const subjectsRes = await axios.get(`${API_BASE}/api/subjects`, { headers: getAuthHeaders() });
      setSubjects(subjectsRes.data || []);
      alert('Max marks updated and saved to backend.');
    } catch (err) {
      alert('Failed to update max marks.');
    }
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

  if (loading) return <div className="p-8 text-center text-lg">Loading exam data...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeReportClass} Student Marks</h2>
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
                      <td key={subject} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getStudentMarks(student.id)[subject]}</td>
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
          {activeReportClass && (
            <div className="grid grid-cols-1 lg:grid-cols-[57%_43%] gap-8 mt-8">
              {/* Grade 5 Details - 60% width */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookA size={22} className="text-orange-600" /> {activeReportClass} Details
                </h3>
                {getClassReportData(activeReportClass).sectionSummary.length > 0 && (
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
                          {getClassReportData(activeReportClass).sectionSummary.map((summary, index) => (
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
                {getClassReportData(activeReportClass).subjectPerformance.length > 0 && (
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
                          {getClassReportData(activeReportClass).subjectPerformance.map((subj, index) => (
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
                {getClassReportData(activeReportClass).overallClassChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={getClassReportData(activeReportClass).overallClassChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={(entry) => `${entry.name} (${entry.value})`}
                      >
                        {getClassReportData(activeReportClass).overallClassChartData.map((entry, index) => (
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
                    {Object.keys(currentSubjectsConfig).map(subject => (
                      <tr key={subject}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{currentSubjectsConfig[subject].maxMarks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            value={tempMarks[subject] || ''}
                            onChange={(e) => handleMarkChange(subject, e.target.value)}
                            min="0"
                            max={currentSubjectsConfig[subject].maxMarks}
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
          initialSubjectsConfig={currentSubjectsConfig}
        />
      )}
    </div>
  );
};

export default ExamModule;