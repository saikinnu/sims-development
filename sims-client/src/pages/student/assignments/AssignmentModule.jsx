import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, LayoutList, FileText, Hourglass, CheckSquare } from 'lucide-react'; // Consolidated to Lucide icons
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const AssignmentModule = () => {
  const navigate = useNavigate();

  // State for assignments and classes
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assignments and classes on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        // Fetch assignments
        const assignmentsRes = await axios.get(`${API_BASE}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : (assignmentsRes.data.assignments || []));
        // Fetch classes
        const classesRes = await axios.get(`${API_BASE}/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(Array.isArray(classesRes.data) ? classesRes.data : (classesRes.data.classes || []));
      } catch (err) {
        setError('Failed to load assignments or classes.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Helper to get class name by id or object
  const getClassName = (classObj) => {
    if (!classObj) return '';
    if (typeof classObj === 'string') {
      const found = classes.find(c => c._id === classObj);
      return found ? found.class_name : classObj;
    }
    return classObj.class_name || '';
  };

  // Status display logic
  const getStatusDisplay = (assignment) => {
    const status = assignment.status;
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isCompleted = status === 'Submitted';
    const isOverdue = status === 'Pending' && dueDate < now;

    if (isCompleted) {
      return (
        <span className="inline-flex items-center font-semibold text-green-600 px-3 py-1 rounded-full bg-green-100 text-xs">
          <CheckCircle size={14} className="mr-1" /> Submitted
        </span>
      );
    } else if (isOverdue || status === 'Late') {
      return (
        <span className="inline-flex items-center font-semibold text-red-600 px-3 py-1 rounded-full bg-red-100 text-xs">
          <Clock size={14} className="mr-1" /> Overdue
        </span>
      );
    } else {
      return (
        <button
          onClick={() => handleUploadClick(assignment._id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center text-sm font-medium shadow-md transition-all duration-200 hover:scale-105"
          aria-label={`Upload assignment for ${assignment.title}`}
        >
          <Upload size={16} className="mr-2" /> Upload
        </button>
      );
    }
  };

  // Upload click handler
  const handleUploadClick = (assignmentId) => {
    navigate(`/student/submit-assignment/${assignmentId}`);
  };

  // Stats
  const totalAssignments = assignments.length;
  const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
  const completedAssignments = assignments.filter(a => a.status === 'Submitted').length;

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading assignments...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

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
              <FileText size={20} /> {/* Adjusted icon size for smaller screens */}
            </div>
            <div>
              <h6 className="text-xs sm:text-sm text-gray-600 uppercase font-semibold mb-1">Total Assignments</h6>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{totalAssignments}</span> {/* Adjusted font size for smaller screens */}
            </div>
          </div>

          {/* Pending Assignments Card */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left transition-transform duration-200 hover:scale-[1.02]">
            <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
              <Hourglass size={20} /> {/* Adjusted icon size for smaller screens */}
            </div>
            <div>
              <h6 className="text-xs sm:text-sm text-gray-600 uppercase font-semibold mb-1">Pending</h6>
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{pendingAssignments}</span> {/* Adjusted font size for smaller screens */}
            </div>
          </div>

          {/* Completed Assignments Card */}
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left transition-transform duration-200 hover:scale-[1.02]">
            <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 flex-shrink-0">
              <CheckSquare size={20} /> {/* Adjusted icon size for smaller screens */}
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
                  const className = getClassName(a.class);
                  return (
                    <tr key={a._id} className={a.status === 'Late' ? 'bg-red-50 hover:bg-red-100 transition-colors duration-150' : 'hover:bg-gray-50 transition-colors duration-150'}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{a.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{className}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${a.status === 'Late' ? 'text-red-600 font-semibold' : 'text-gray-800'}`}>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          a.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                          a.status === 'Late' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {a.status === 'Submitted' ? 'Completed' : a.status === 'Late' ? 'Overdue' : 'Pending'}
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
