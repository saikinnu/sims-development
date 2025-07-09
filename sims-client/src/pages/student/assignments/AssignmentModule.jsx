import React from 'react';
import { Upload, CheckCircle, Clock, LayoutList, FileText, Hourglass, CheckSquare } from 'lucide-react'; // Consolidated to Lucide icons
import { useNavigate } from 'react-router-dom';

const AssignmentModule = () => {
  const navigate = useNavigate();

  const classes = [
    { id: 'math101', name: 'Mathematics 101' },
    { id: 'science201', name: 'Science 201' }
  ];

  const assignments = [
    { id: 1, title: 'Algebra Worksheet', class: 'math101', dueDate: '2025-06-15', status: 'pending', totalStudents: 25 },
    { id: 2, title: 'Chemistry Lab Report', class: 'science201', dueDate: '2025-07-28', status: 'pending', totalStudents: 30 },
    { id: 3, title: 'Geometry Quiz', class: 'math101', dueDate: '2025-06-08', status: 'completed', totalStudents: 25 },
    { id: 4, title: 'Biology Project', class: 'science201', dueDate: '2025-06-01', status: 'completed', totalStudents: 30 }
  ];

  const handleUploadClick = (assignmentId) => {
    // In a real application, this would navigate to a submission page.
    // For this mock, we'll just log it.
    console.log(`Navigating to submit assignment: ${assignmentId}`);
    // navigate(`/student/submit-assignment/${assignmentId}`); // Uncomment if you have this route
  };

  const getStatusDisplay = (assignment) => {
    const isCompleted = assignment.status === 'completed';
    const isOverdue = !isCompleted && new Date(assignment.dueDate) < new Date();

    if (isCompleted) {
      return (
        <span className="inline-flex items-center font-semibold text-green-600 px-3 py-1 rounded-full bg-green-100 text-xs">
          <CheckCircle size={14} className="mr-1" /> Submitted
        </span>
      );
    } else if (isOverdue) {
      return (
        <span className="inline-flex items-center font-semibold text-red-600 px-3 py-1 rounded-full bg-red-100 text-xs">
          <Clock size={14} className="mr-1" /> Overdue
        </span>
      );
    } else {
      return (
        <button
          onClick={() => handleUploadClick(assignment.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center text-sm font-medium shadow-md transition-all duration-200 hover:scale-105"
          aria-label={`Upload assignment for ${assignment.title}`}
        >
          <Upload size={16} className="mr-2" /> Upload
        </button>
      );
    }
  };

  const totalAssignments = assignments.length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3 mb-4 sm:mb-0">
            <LayoutList size={36} className="text-indigo-600" /> Assignments Overview
          </h1>
          <span className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Stats Cards - Now always in 3 columns */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10"> {/* Changed to grid-cols-3 for all screen sizes */}
          {/* Total Assignments Card */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left transition-transform duration-200 hover:scale-[1.02]">
            <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <FileText size={20} sm:size={28} /> {/* Adjusted icon size for smaller screens */}
            </div>
            <div>
              <h6 className="text-xs sm:text-sm text-gray-600 uppercase font-semibold mb-1">Total Assignments</h6>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{totalAssignments}</span> {/* Adjusted font size for smaller screens */}
            </div>
          </div>

          {/* Pending Assignments Card */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left transition-transform duration-200 hover:scale-[1.02]">
            <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
              <Hourglass size={20} sm:size={28} /> {/* Adjusted icon size for smaller screens */}
            </div>
            <div>
              <h6 className="text-xs sm:text-sm text-gray-600 uppercase font-semibold mb-1">Pending</h6>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{pendingAssignments}</span> {/* Adjusted font size for smaller screens */}
            </div>
          </div>

          {/* Completed Assignments Card */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left transition-transform duration-200 hover:scale-[1.02]">
            <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 flex-shrink-0">
              <CheckSquare size={20} sm:size={28} /> {/* Adjusted icon size for smaller screens */}
            </div>
            <div>
              <h6 className="text-xs sm:text-sm text-gray-600 uppercase font-semibold mb-1">Completed</h6>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{completedAssignments}</span> {/* Adjusted font size for smaller screens */}
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="min-w-full overflow-x-auto"> {/* Added overflow-x-auto for responsiveness */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((a) => {
                  const className = classes.find(c => c.id === a.class)?.name || a.class;
                  const isCompleted = a.status === 'completed';
                  const isOverdue = !isCompleted && new Date(a.dueDate) < new Date();

                  return (
                    <tr key={a.id} className={isOverdue ? 'bg-red-50 hover:bg-red-100 transition-colors duration-150' : 'hover:bg-gray-50 transition-colors duration-150'}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{a.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{className}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-800'}`}>
                        {a.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isCompleted ? 'bg-green-100 text-green-800' :
                          isOverdue ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isCompleted ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusDisplay(a)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default AssignmentModule;
