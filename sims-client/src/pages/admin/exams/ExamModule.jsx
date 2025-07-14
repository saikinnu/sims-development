import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart2, Users, PieChart,
  TrendingUp, TrendingDown, MinusCircle, BookA, LayoutList
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Import the mock data and constants from ReportsData.jsx
// import {
//   generateSchoolData,
//   GOOD_THRESHOLD,
//   AVERAGE_THRESHOLD,
//   POOR_THRESHOLD
// } from './ReportsData';

const GOOD_THRESHOLD = 75;
const AVERAGE_THRESHOLD = 50;
const POOR_THRESHOLD = 0;

const ExamModule = () => {
  const [activeReportClass, setActiveReportClass] = useState('Grade 1'); // Default to Grade 1 initially
  const [showCompleteSchoolReport, setShowCompleteSchoolReport] = useState(false);

  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);

  useEffect(() => {
    // Fetch data from backend API using axios
    axios.get('http://localhost:5000/api/exam-reports//overview')
      .then(res => {
        setExams(res.data.exams || []);
        setStudents(res.data.students || []);
        setStudentGrades(res.data.grades || []);
      })
      .catch(err => {
        console.error('Failed to fetch exam report data:', err);
      });
  }, []);

  // --- Report Calculations (Memoized for performance) ---

  const getStudentGradeCategory = useCallback((percentage) => {
    if (percentage >= GOOD_THRESHOLD) return 'Good';
    if (percentage >= AVERAGE_THRESHOLD) return 'Average';
    return 'Poor';
  }, []);

  const getCompletedExams = useMemo(() => {
    return exams.filter(exam => exam.status === 'Completed');
  }, [exams]);

  // All classes from 1 to 10 for button display
  const allClasses = useMemo(() => {
    const classes = [];
    for (let i = 1; i <= 10; i++) {
      classes.push(`Grade ${i}`);
    }
    return classes;
  }, []);

  // Calculate reports for a specific class
  const getClassReportData = useCallback((className) => {
    const classStudents = students.filter(student => student.class === className);
    const classExams = getCompletedExams.filter(exam => exam.class === className);

    const sections = Array.from(new Set(classStudents.map(s => s.section))).sort();
    const subjects = Array.from(new Set(classExams.map(e => e.subject))).sort();

    // Section Summary
    const sectionSummary = sections.map(section => {
      const studentsInSection = classStudents.filter(s => s.section === section);
      let totalMarksAllExams = 0;
      let totalMaxMarksAllExams = 0;
      let studentsGradedCount = 0;

      let goodCount = 0;
      let averageCount = 0;
      let poorCount = 0;

      studentsInSection.forEach(student => {
        let studentOverallMarks = 0;
        let studentOverallMaxMarks = 0;
        let studentExamsAttempted = 0;

        const studentGradesInClass = studentGrades.filter(sg => sg.studentId === student.id && classExams.some(e => e.examId === sg.examId));

        if (studentGradesInClass.length > 0) {
          studentsGradedCount++;
        }

        studentGradesInClass.forEach(grade => {
          const exam = classExams.find(e => e.examId === grade.examId);
          if (exam) {
            studentOverallMarks += grade.marks;
            studentOverallMaxMarks += exam.maxMarks;
            studentExamsAttempted++;
          }
        });

        // Only categorize students who have attempted at least one exam in this class
        if (studentExamsAttempted > 0 && studentOverallMaxMarks > 0) {
          const percentage = (studentOverallMarks / studentOverallMaxMarks) * 100;
          const category = getStudentGradeCategory(percentage);
          if (category === 'Good') goodCount++;
          else if (category === 'Average') averageCount++;
          else poorCount++;
        }

        totalMarksAllExams += studentOverallMarks; // Sum up for overall section avg
        totalMaxMarksAllExams += studentOverallMaxMarks; // Sum up for overall section avg
      });

      const avgPercentage = totalMaxMarksAllExams > 0 ? ((totalMarksAllExams / totalMaxMarksAllExams) * 100) : 0;
      return {
        section: section,
        totalStudents: studentsInSection.length,
        studentsGraded: studentsGradedCount,
        averagePercentage: avgPercentage.toFixed(2),
        good: goodCount,
        average: averageCount,
        poor: poorCount
      };
    }).filter(s => s.totalStudents > 0);

    // Subject Performance (Good, Average, Poor)
    const subjectPerformance = subjects.map(subject => {
      const subjectExams = classExams.filter(exam => exam.subject === subject);
      let goodCount = 0;
      let averageCount = 0;
      let poorCount = 0;
      let totalStudentsWithGradesForSubject = 0;

      classStudents.forEach(student => {
        let studentTotalMarksForSubject = 0;
        let studentTotalMaxMarksForSubject = 0;
        let examsAttemptedForSubject = 0;

        subjectExams.forEach(exam => {
          const grade = studentGrades.find(sg => sg.examId === exam.examId && sg.studentId === student.id);
          if (grade) {
            studentTotalMarksForSubject += grade.marks;
            studentTotalMaxMarksForSubject += exam.maxMarks;
            examsAttemptedForSubject++;
          }
        });

        if (examsAttemptedForSubject > 0) {
          totalStudentsWithGradesForSubject++;
          const percentage = (studentTotalMarksForSubject / studentTotalMaxMarksForSubject) * 100;
          const category = getStudentGradeCategory(percentage);
          if (category === 'Good') goodCount++;
          else if (category === 'Average') averageCount++;
          else poorCount++;
        }
      });

      return {
        subject: subject,
        good: goodCount,
        average: averageCount,
        poor: poorCount,
        totalGradedStudents: totalStudentsWithGradesForSubject
      };
    }).filter(s => s.totalGradedStudents > 0);


    // Overall Class Performance for Pie Chart
    const overallClassGrades = { Good: 0, Average: 0, Poor: 0 };
    let totalStudentsConsideredForOverall = 0;

    classStudents.forEach(student => {
      let studentOverallMarks = 0;
      let studentOverallMaxMarks = 0;
      let studentExamsAttempted = 0;

      classExams.forEach(exam => {
        const grade = studentGrades.find(sg => sg.examId === exam.examId && sg.studentId === student.id);
        if (grade) {
          studentOverallMarks += grade.marks;
          studentOverallMaxMarks += exam.maxMarks;
          studentExamsAttempted++;
        }
      });

      if (studentExamsAttempted > 0 && studentOverallMaxMarks > 0) {
        totalStudentsConsideredForOverall++;
        const percentage = (studentOverallMarks / studentOverallMaxMarks) * 100;
        const category = getStudentGradeCategory(percentage);
        overallClassGrades[category]++;
      }
    });

    const overallClassChartData = [
      { name: 'Good', value: overallClassGrades.Good, color: '#22C55E' },
      { name: 'Average', value: overallClassGrades.Average, color: '#EAB308' },
      { name: 'Poor', value: overallClassGrades.Poor, color: '#EF4444' },
    ].filter(data => data.value > 0);


    return {
      sectionSummary,
      subjectPerformance,
      overallClassChartData,
      totalStudentsConsideredForOverall
    };
  }, [students, getCompletedExams, studentGrades, getStudentGradeCategory]);

  const currentClassReport = useMemo(() => {
    if (!activeReportClass) return null;
    return getClassReportData(activeReportClass);
  }, [activeReportClass, getClassReportData]);


  // Calculate Complete School Report
  const completeSchoolReportData = useMemo(() => {
    const schoolOverallGrades = { Good: 0, Average: 0, Poor: 0 };
    const allCompletedExams = getCompletedExams;
    let totalStudentsConsidered = 0;

    const studentsAccountedFor = new Set();

    students.forEach(student => {
      let studentOverallMarks = 0;
      let studentOverallMaxMarks = 0;
      let studentExamsAttempted = 0;

      const relevantExams = allCompletedExams.filter(exam => exam.class === student.class);

      relevantExams.forEach(exam => {
        const grade = studentGrades.find(sg => sg.examId === exam.examId && sg.studentId === student.id);
        if (grade) {
          studentOverallMarks += grade.marks;
          studentOverallMaxMarks += exam.maxMarks;
          studentExamsAttempted++;
        }
      });

      if (studentExamsAttempted > 0 && studentOverallMaxMarks > 0) {
        if (!studentsAccountedFor.has(student.id)) {
          studentsAccountedFor.add(student.id);
          const percentage = (studentOverallMarks / studentOverallMaxMarks) * 100;
          const category = getStudentGradeCategory(percentage);
          schoolOverallGrades[category]++;
          totalStudentsConsidered++;
        }
      }
    });

    const chartData = [
      { name: 'Good', value: schoolOverallGrades.Good, color: '#22C55E' },
      { name: 'Average', value: schoolOverallGrades.Average, color: '#EAB308' },
      { name: 'Poor', value: schoolOverallGrades.Poor, color: '#EF4444' },
    ].filter(data => data.value > 0);

    return {
      chartData: chartData,
      totalStudentsConsidered: totalStudentsConsidered
    };
  }, [students, studentGrades, getCompletedExams, getStudentGradeCategory]);


  // Chart colors (defined once, consistent)
  const PIE_COLORS = ['#22C55E', '#EAB308', '#EF4444'];

  // Render Custom Tooltip for Recharts Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-gray-800">{`${payload[0].name}: ${payload[0].value} students`}</p>
          <p className="text-xs text-gray-600">{`Percentage: ${(payload[0].percent * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header and Main Report Type Selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-0 flex items-center gap-3">
            <LayoutList size={36} className="text-purple-600" />
            Exams Performance Reports
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setActiveReportClass('Grade 1'); setShowCompleteSchoolReport(false); }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center
                ${!showCompleteSchoolReport ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:-translate-y-0.5' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50'}`}
            >
              <BarChart2 className="mr-2" size={20} /> Class Reports
            </button>
            <button
              onClick={() => { setActiveReportClass(null); setShowCompleteSchoolReport(true); }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center
                ${showCompleteSchoolReport ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:-translate-y-0.5' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50'}`}
            >
              <Users className="mr-2" size={20} /> Complete Report
            </button>
          </div>
        </div>

        {/* --- Class Reports Section --- */}
        {!showCompleteSchoolReport && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Class Performance Overview</h2>

            {/* Class Selection Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-gray-200 mb-8 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
              {allClasses.map(cls => (
                <button
                  key={cls}
                  onClick={() => setActiveReportClass(cls)}
                  className={`flex-shrink-0 px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-200 rounded-lg whitespace-nowrap
                    ${activeReportClass === cls
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cls.replace('Grade ', 'Class ')}
                </button>
              ))}
            </div>

            {/* Content for selected Class Report */}
            {activeReportClass && currentClassReport ? (
              currentClassReport.totalStudentsConsideredForOverall > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                  {/* Side 1: Section Summary & Subject Performance (3/5 = 60%) */}
                  <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <BookA size={24} className="text-orange-600" /> {activeReportClass} Details
                    </h3>

                    {currentClassReport.sectionSummary.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Section Summary</h4>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Section</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students (Graded / Total)</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg. Performance (%)</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-green-600 uppercase tracking-wider"><TrendingUp size={16} className="inline-block mr-1" />Good</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-yellow-600 uppercase tracking-wider"><MinusCircle size={16} className="inline-block mr-1" />Average</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider"><TrendingDown size={16} className="inline-block mr-1" />Poor</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {currentClassReport.sectionSummary.map((summary, index) => (
                                <tr key={index} className="transition-colors duration-200 hover:bg-indigo-50">
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{summary.section}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{summary.studentsGraded} / {summary.totalStudents}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{summary.averagePercentage}%</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{summary.good}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{summary.average}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{summary.poor}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {currentClassReport.sectionSummary.length === 0 && (
                      <p className="text-center text-gray-500 py-6">No section data for this class (students might not have grades recorded).</p>
                    )}


                    {currentClassReport.subjectPerformance.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Subject Performance (by Grade Category)</h4>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-green-600 uppercase tracking-wider"><TrendingUp size={16} className="inline-block mr-1" />Good</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-yellow-600 uppercase tracking-wider"><MinusCircle size={16} className="inline-block mr-1" />Average</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider"><TrendingDown size={16} className="inline-block mr-1" />Poor</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Graded Students</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {currentClassReport.subjectPerformance.map((subj, index) => (
                                <tr key={index} className="transition-colors duration-200 hover:bg-indigo-50">
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{subj.subject}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{subj.good}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{subj.average}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{subj.poor}</td>
                                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{subj.totalGradedStudents}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {currentClassReport.subjectPerformance.length === 0 && (
                      <p className="text-center text-gray-500 py-6">No subject performance data for this class (students might not have grades recorded).</p>
                    )}
                  </div>

                  {/* Side 2: Overall Class Report Pie Chart (2/5 = 40%) */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <PieChart size={24} className="text-purple-600" /> Overall Performance ({activeReportClass})
                      </h3>
                      {currentClassReport.overallClassChartData.length > 0 && currentClassReport.totalStudentsConsideredForOverall > 0 ? (
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
                              labelLine={false} // Hide label lines for cleaner look
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Display name and percentage
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
                        <div className="text-center text-gray-500 py-10">No overall performance data for this class yet. Make sure exams are 'Completed' and grades are in.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-20 text-lg rounded-xl bg-white shadow-md p-8 border border-gray-200">
                  No detailed report data available for {activeReportClass}. Ensure students have completed exams and grades are recorded.
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 py-20 text-lg rounded-xl bg-white shadow-md p-8 border border-gray-200">
                Select a Class (e.g., Class 1) to view its detailed performance reports.
              </div>
            )}
          </>
        )}

        {/* --- Complete School Report Section --- */}
        {showCompleteSchoolReport && (
          <div className="grid grid-cols-1 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={24} className="text-indigo-600" /> Complete School Performance Overview
              </h3>
              {completeSchoolReportData.totalStudentsConsidered > 0 && completeSchoolReportData.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsPieChart>
                    <Pie
                      data={completeSchoolReportData.chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      labelLine={false} // Hide label lines for cleaner look
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Display name and percentage
                    >
                      {completeSchoolReportData.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-10">No overall school performance data available yet. Ensure exams are 'Completed' and grades are recorded across classes.</div>
              )}
            </div>
          </div>
        )}
      </div>
  );
};

export default ExamModule;