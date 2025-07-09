import React, { useState, useMemo } from 'react';
import { BookOpen, Award, CheckCircle, XCircle, BarChart2 } from 'lucide-react';

const ExamModule = () => {
  const sampleStudentData = {
    id: 'S001',
    rollNo: '2025001',
    name: 'Alice Johnson',
    class: 'Grade 5',
    section: 'A',
    marks: {
      Science: 72,
      'Social Studies': 28,
      Mathematics: 85,
      English: 60,
      'Computer Science': 55,
    },
  };

  const sampleSubjectsConfig = {
    Science: { maxMarks: 80 },
    'Social Studies': { maxMarks: 50 },
    Mathematics: { maxMarks: 100 },
    English: { maxMarks: 70 },
    'Computer Science': { maxMarks: 60 },
  };

  const [loggedInStudent] = useState(sampleStudentData);
  const [currentSubjectsConfig] = useState(sampleSubjectsConfig);

  const currentExams = useMemo(() => {
    return Object.keys(currentSubjectsConfig).map((subject) => ({
      subject: subject,
      maxMarks: currentSubjectsConfig[subject].maxMarks,
    }));
  }, [currentSubjectsConfig]);

  if (!loggedInStudent) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen font-sans antialiased flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-700">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Student Data Not Found</h2>
          <p>Unable to load your exam results. Please try again later.</p>
        </div>
      </div>
    );
  }

  const totalScoredMarks = useMemo(() => {
    let total = 0;
    for (const subject in currentSubjectsConfig) {
      total += loggedInStudent.marks[subject] || 0;
    }
    return total;
  }, [loggedInStudent, currentSubjectsConfig]);

  const totalMaxMarks = useMemo(() => {
    let total = 0;
    for (const subject in currentSubjectsConfig) {
      total += currentSubjectsConfig[subject].maxMarks || 0;
    }
    return total;
  }, [currentSubjectsConfig]);

  const overallPercentage = totalMaxMarks > 0 ? ((totalScoredMarks / totalMaxMarks) * 100).toFixed(2) : 0;

  const overallPerformanceCategory = useMemo(() => {
    if (overallPercentage >= 75) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (overallPercentage >= 50) return { label: 'Good', color: 'text-yellow-600', icon: Award };
    return { label: 'Needs Improvement', color: 'text-red-600', icon: XCircle };
  }, [overallPercentage]);

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Updated Header with better mobile alignment */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <BookOpen size={32} className="text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Exam Results
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-base sm:text-lg font-medium text-gray-700">
          <span className="text-gray-500 text-sm sm:text-base">Welcome,</span>
          <span className="font-semibold">
            {loggedInStudent.name} (Roll No: {loggedInStudent.rollNo})
          </span>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Marks Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">Total Marks Scored</p>
            <p className="text-3xl font-bold">{totalScoredMarks} / {totalMaxMarks}</p>
          </div>
          <Award size={48} className="opacity-70" />
        </div>

        {/* Overall Percentage Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overall Percentage</p>
            <p className="text-3xl font-bold text-gray-900">{overallPercentage}%</p>
          </div>
          <div className={`flex items-center gap-2 ${overallPerformanceCategory.color}`}>
            <overallPerformanceCategory.icon size={32} />
            <span className="text-xl font-semibold">{overallPerformanceCategory.label}</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart2 size={24} className="text-teal-600" /> Subject-wise Scores
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Scored</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.keys(currentSubjectsConfig).map((subject) => {
              const exam = {
                subject: subject,
                maxMarks: currentSubjectsConfig[subject].maxMarks,
              };
              const scored = loggedInStudent.marks[exam.subject] || 0;
              const percentage = exam.maxMarks > 0 ? ((scored / exam.maxMarks) * 100).toFixed(2) : 0;
              const status = percentage >= 75 ? 'Excellent' : percentage >= 50 ? 'Good' : 'Needs Improvement';
              const statusColor = percentage >= 75 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600';

              return (
                <tr key={exam.subject} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exam.maxMarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scored}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{percentage}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${statusColor}`}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamModule;