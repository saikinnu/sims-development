import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  ClipboardList, // Main icon for Assignment Module
  Tag, // For Subject
  Calendar, // For Due Date
  Users, // For Class
  CheckCircle, // For Graded/Submitted status
  Clock, // For Pending status
  AlertCircle, // For Late status
  FileText, // For Description
  UserCheck, // For Submissions
  Award, // For Grade
  Download, // For download button
  Info // For general info/error alerts
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const AssignmentModule = () => {
  // State
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    class: '',
    subject: '',
    dueDate: '',
    description: '',
  });
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch assignments
  useEffect(() => {
    fetchAssignments();
    fetchClasses();
    fetchSubjects();
    // eslint-disable-next-line
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      console.log(token);
      const res = await fetch(`${API_BASE}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : (data.assignments || []));
    } catch (err) {
      setAlert({ message: 'Failed to fetch assignments', type: 'error' });
    }
    setLoading(false);
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_BASE}/classes`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('authToken'))}` },
      });
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : (data.classes || []));
    } catch (err) {
      setAlert({ message: 'Failed to fetch classes', type: 'error' });
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/subjects`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('authToken'))}` },
      });
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : (data.subjects || []));
    } catch (err) {
      setAlert({ message: 'Failed to fetch subjects', type: 'error' });
    }
  };

  // Fetch submissions for selected assignment
  const fetchSubmissions = async (assignmentId) => {
    setSubmissions([]); // default to empty array
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      const res = await fetch(`${API_BASE}/assignment-submissions/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : (data.submissions || []));
    } catch (err) {
      setSubmissions([]); // ensure it's always an array on error
      setAlert({ message: 'Failed to fetch submissions', type: 'error' });
    }
  };

  // Handle view assignment (fetch submissions)
  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment._id);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  // Handle create assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.class || !newAssignment.subject || !newAssignment.dueDate) {
      setAlert({ message: 'Please fill in all required fields (Title, Class, Subject, Due Date).', type: 'error' });
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      const res = await fetch(`${API_BASE}/assignments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newAssignment.title,
          class: newAssignment.class,
          subject: newAssignment.subject,
          dueDate: newAssignment.dueDate,
          description: newAssignment.description,
        }),
      });
      if (!res.ok) throw new Error('Failed to create assignment');
      setAlert({ message: 'Assignment created successfully!', type: 'success' });
      setShowCreateForm(false);
      setNewAssignment({ title: '', class: '', subject: '', dueDate: '', description: '' });
      fetchAssignments();
    } catch (err) {
      setAlert({ message: 'Failed to create assignment', type: 'error' });
    }
  };

  // Handle delete assignment
  const deleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      const res = await fetch(`${API_BASE}/assignments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete assignment');
      setAlert({ message: 'Assignment deleted successfully!', type: 'success' });
      fetchAssignments();
    } catch (err) {
      setAlert({ message: 'Failed to delete assignment', type: 'error' });
    }
  };

  // Open edit modal and pre-fill form
  const handleEditAssignment = (assignment) => {
    setEditAssignment(assignment);
    setShowEditForm(true);
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditAssignment({ ...editAssignment, [name]: value });
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editAssignment.title || !editAssignment.class || !editAssignment.subject || !editAssignment.dueDate) {
      setAlert({ message: 'Please fill in all required fields (Title, Class, Subject, Due Date).', type: 'error' });
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      const res = await fetch(`${API_BASE}/assignments/${editAssignment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editAssignment.title,
          class: editAssignment.class,
          subject: editAssignment.subject,
          dueDate: editAssignment.dueDate,
          description: editAssignment.description,
        }),
      });
      if (!res.ok) throw new Error('Failed to update assignment');
      setAlert({ message: 'Assignment updated successfully!', type: 'success' });
      setShowEditForm(false);
      setEditAssignment(null);
      fetchAssignments();
    } catch (err) {
      setAlert({ message: 'Failed to update assignment', type: 'error' });
    }
  };

  // Filter assignments by selected class (defensive)
  const filteredAssignments = Array.isArray(assignments)
    ? (selectedClassFilter === 'All'
        ? assignments
        : assignments.filter(a => (a.class && (a.class._id || a.class) === selectedClassFilter)))
    : [];

  // Available classes for dropdown
  const allAvailableClasses = ['All', ...classes.map(c => c._id)];

  // Helper to get class name by id
  const getClassName = (classObj) => {
    if (!classObj) return '';
    if (typeof classObj === 'string') {
      const found = classes.find(c => c._id === classObj);
      return found ? found.class_name : classObj;
    }
    return classObj.class_name || '';
  };

  // Helper to get subject name by id
  const getSubjectName = (subjectObj) => {
    if (!subjectObj) return '';
    if (typeof subjectObj === 'string') {
      const found = subjects.find(s => s._id === subjectObj);
      return found ? found.name : subjectObj;
    }
    return subjectObj.name || '';
  };

  // Calculate summary stats for the "View Assignment" modal based on submissions
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.grade && s.grade !== 'Incomplete').length;
  const pendingSubmissions = submissions.filter(s => !s.grade || s.grade === 'Incomplete').length;
  const missingSubmissions = selectedAssignment ? (selectedAssignment.submissions || 0) - totalSubmissions : 0;


  return (
        <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-0 flex items-center gap-3">
            <ClipboardList size={36} className="text-purple-600" />
            Assignment Management
          </h1>
          <button
            onClick={() => { setShowCreateForm(true); setAlert({ message: '', type: '' }); }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-200 shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
          >
            <PlusCircle className="mr-2" size={20} />
            Create New Assignment
          </button>
        </div>

        {/* Alert Message */}
        {alert.message && (
          <div className={`flex items-center justify-between p-4 mb-6 rounded-lg shadow-md ${
            alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            alert.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`} role="alert">
            <div className="flex items-center">
              {alert.type === 'success' && <CheckCircle className="mr-3" size={20} />}
              {alert.type === 'error' && <Info className="mr-3" size={20} />}
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ message: '', type: '' })}
              className={`p-1 rounded-full transition-colors ${
                alert.type === 'success' ? 'hover:bg-green-200' :
                alert.type === 'error' ? 'hover:bg-red-200' :
                'hover:bg-blue-200'
              }`}
              aria-label="Dismiss alert"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Class Filter Dropdown and Stats Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Class:</label>
            <div className="relative">
              <select
                id="classFilter"
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
              >
                {allAvailableClasses.map((cls) => (
                  <option key={cls} value={cls}>{getClassName(cls)}</option>
                ))}
              </select>
              <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Assignments</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {selectedClassFilter === "All"
                  ? assignments.length
                  : assignments.filter(a => (a.class && (a.class._id || a.class) === selectedClassFilter)).length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Pending Submissions</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {filteredAssignments.filter(a => !a.grade || a.grade === 'Incomplete').length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Late Submissions</h3>
              <p className="text-3xl font-bold text-red-600">
                {filteredAssignments.filter(a => a.status === "Late").length}
              </p>
            </div>
          </div>
        </div>


        {/* Assignments Table */}
        <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Graded</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment._id} className="transition-colors duration-200 hover:bg-indigo-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getClassName(assignment.class)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getSubjectName(assignment.subject)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                        ${assignment.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          assignment.status === "Submitted" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                        }`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.submissions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.graded}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="p-2.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          onClick={() => handleViewAssignment(assignment)}
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          title="Edit Assignment"
                          onClick={() => handleEditAssignment(assignment)}
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          onClick={() => deleteAssignment(assignment._id)}
                          title="Delete Assignment"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-6 text-center text-gray-500">
                    No assignments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Assignment Form (Modal) */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
                <button
                  onClick={() => { setShowCreateForm(false); setAlert({ message: '', type: '' }); }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newAssignment.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      required
                      placeholder="e.g., Math Homework Chapter 5"
                    />
                  </div>
                  <div>
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        id="class"
                        name="class"
                        value={newAssignment.class}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                        required
                      >
                        <option value="">Select Class</option>
                        {allAvailableClasses.filter(cls => cls !== "All").map((cls) => (
                          <option key={cls} value={cls}>{getClassName(cls)}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        value={newAssignment.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>{subject.name}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newAssignment.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newAssignment.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      rows="3"
                      placeholder="Provide a brief description of the assignment..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => { setShowCreateForm(false); setAlert({ message: '', type: '' }); }}
                      className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
                    >
                      <X className="mr-2" size={20} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                    >
                      <PlusCircle className="mr-2" size={20} />
                      Create Assignment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Assignment Modal */}
        {showEditForm && editAssignment && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Assignment</h2>
                <button
                  onClick={() => { setShowEditForm(false); setEditAssignment(null); setAlert({ message: '', type: '' }); }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      value={editAssignment.title}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      required
                      placeholder="e.g., Math Homework Chapter 5"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-class" className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        id="edit-class"
                        name="class"
                        value={editAssignment.class && editAssignment.class._id ? editAssignment.class._id : editAssignment.class}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                        required
                      >
                        <option value="">Select Class</option>
                        {allAvailableClasses.filter(cls => cls !== "All").map((cls) => (
                          <option key={cls} value={cls}>{getClassName(cls)}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        id="edit-subject"
                        name="subject"
                        value={editAssignment.subject && editAssignment.subject._id ? editAssignment.subject._id : editAssignment.subject}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>{subject.name}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      id="edit-dueDate"
                      name="dueDate"
                      value={editAssignment.dueDate ? editAssignment.dueDate.slice(0, 10) : ''}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={editAssignment.description}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      rows="3"
                      placeholder="Provide a brief description of the assignment..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => { setShowEditForm(false); setEditAssignment(null); setAlert({ message: '', type: '' }); }}
                      className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
                    >
                      <X className="mr-2" size={20} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                    >
                      <Pencil className="mr-2" size={20} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Assignment Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ClipboardList size={24} className="text-purple-600" /> {selectedAssignment.title}
                </h2>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Assignment Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Users size={20} className="text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Class</h3>
                      <p className="text-base font-semibold text-gray-900">{getClassName(selectedAssignment.class)}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Tag size={20} className="text-green-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Subject</h3>
                      <p className="text-base font-semibold text-gray-900">{getSubjectName(selectedAssignment.subject)}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Calendar size={20} className="text-orange-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Due Date</h3>
                      <p className="text-base font-semibold text-gray-900">{selectedAssignment.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center gap-2"><FileText size={20} className="text-blue-500" /> Description</h3>
                  <p className="text-gray-800 leading-relaxed">{selectedAssignment.description || "No description provided."}</p>
                </div>

                {/* Submissions Table */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">Submissions ({submissions.length})</h3>
                <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted On</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Feedback</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {submissions.map((submission) => (
                        <tr key={submission._id} className="transition-colors duration-200 hover:bg-indigo-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.studentName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.submittedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                              ${submission.grade && submission.grade !== 'Incomplete' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.grade}</td>
                          <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate text-sm text-gray-700">{submission.feedback || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="p-2.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors" title="Grade Submission">
                                <Award size={20} />
                              </button>
                              <button className="p-2.5 rounded-full text-gray-600 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors" title="Download Submission">
                                <Download size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats for Submissions */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">Submission Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-5 rounded-xl shadow-sm border border-blue-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Submissions</h3>
                    <p className="text-3xl font-bold text-blue-600 flex items-center gap-1">
                      <UserCheck size={28} /> {totalSubmissions}
                    </p>
                  </div>
                  <div className="bg-green-50 p-5 rounded-xl shadow-sm border border-green-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Graded</h3>
                    <p className="text-3xl font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle size={28} /> {gradedSubmissions}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-5 rounded-xl shadow-sm border border-yellow-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600 flex items-center gap-1">
                      <Clock size={28} /> {pendingSubmissions}
                    </p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-xl shadow-sm border border-red-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Missing</h3>
                    <p className="text-3xl font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle size={28} /> {Math.max(0, missingSubmissions)} {/* Ensure non-negative */}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default AssignmentModule;