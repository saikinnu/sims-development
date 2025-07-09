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

const AssignmentModule = () => {
  // Sample data with class-wise assignments
  const initialAssignments = [
    { id: 1, title: "Algebra Homework", class: "Grade 10", subject: "Mathematics", dueDate: "2025-11-10", status: "Pending", submissions: 20, graded: 5, description: "Complete exercises from chapter 3, sections 1-5. Show all work and submit on time." },
    { id: 2, title: "Chemistry Lab Report", class: "Grade 11", subject: "Science", dueDate: "2025-11-15", status: "Submitted", submissions: 18, graded: 18, description: "Write a detailed lab report on the acid-base titration experiment. Include methodology, results, and conclusion." },
    { id: 3, title: "World War II Essay", class: "Grade 9", subject: "History", dueDate: "2025-11-05", status: "Late", submissions: 15, graded: 10, description: "Research and write an essay on the causes and consequences of World War II. Minimum 1000 words." },
    { id: 4, title: "Poetry Analysis", class: "Grade 10", subject: "English", dueDate: "2025-11-20", status: "Pending", submissions: 22, graded: 0, description: "Analyze the themes and literary devices in 'The Raven' by Edgar Allan Poe." },
  ];

  // Mock submission data for the "View Assignment" modal
  const mockSubmissionsData = [
    { id: 1, studentName: "John Doe", submittedDate: "2025-11-10", status: "Graded", grade: "A", feedback: "Well done! Excellent analysis and clear presentation." },
    { id: 2, studentName: "Jane Smith", submittedDate: "2025-11-09", status: "Pending", grade: "-", feedback: "" },
    { id: 3, studentName: "Alice Johnson", submittedDate: "2025-11-11", status: "Graded", grade: "B+", feedback: "Good effort, but some minor calculation errors." },
    { id: 4, studentName: "Bob Williams", submittedDate: "2025-11-12", status: "Pending", grade: "-", feedback: "" },
    { id: 5, studentName: "Charlie Brown", submittedDate: "2025-11-13", status: "Graded", grade: "A-", feedback: "Strong arguments, consider more diverse sources next time." },
  ];

  const [assignments, setAssignments] = useState(() => {
    const storedAssignments = localStorage.getItem('assignments');
    return storedAssignments ? JSON.parse(storedAssignments) : initialAssignments;
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    class: "",
    subject: "",
    dueDate: "",
    description: "",
  });
  const [selectedClassFilter, setSelectedClassFilter] = useState("All"); // Filter by class
  const [alert, setAlert] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  // Available classes for dropdown (dynamically generated from existing assignments or a predefined list)
  const allAvailableClasses = ["All", ...new Set(assignments.map(a => a.class))].sort();

  // Update localStorage whenever assignments change
  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newAssignment.title || !newAssignment.class || !newAssignment.subject || !newAssignment.dueDate) {
      setAlert({ message: 'Please fill in all required fields (Title, Class, Subject, Due Date).', type: 'error' });
      return;
    }

    const newId = assignments.length > 0 ? Math.max(...assignments.map(a => a.id)) + 1 : 1;
    setAssignments([
      ...assignments,
      {
        id: newId,
        title: newAssignment.title,
        class: newAssignment.class,
        subject: newAssignment.subject,
        dueDate: newAssignment.dueDate,
        status: "Pending", // New assignments are always pending initially
        submissions: 0, // No submissions initially
        graded: 0, // No graded submissions initially
        description: newAssignment.description,
      },
    ]);
    setNewAssignment({ title: "", class: "", subject: "", dueDate: "", description: "" });
    setShowCreateForm(false);
    setAlert({ message: 'Assignment created successfully!', type: 'success' });
  };

  const deleteAssignment = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== id));
      setAlert({ message: 'Assignment deleted successfully!', type: 'success' });
    }
  };

  // Filter assignments by selected class
  const filteredAssignments = selectedClassFilter === "All"
    ? assignments
    : assignments.filter(assignment => assignment.class === selectedClassFilter);

  // Calculate summary stats for the "View Assignment" modal based on mockSubmissionsData
  const totalSubmissions = mockSubmissionsData.length;
  const gradedSubmissions = mockSubmissionsData.filter(s => s.status === "Graded").length;
  const pendingSubmissions = mockSubmissionsData.filter(s => s.status === "Pending").length;
  const missingSubmissions = selectedAssignment ? selectedAssignment.submissions - totalSubmissions : 0;


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
                  <option key={cls} value={cls}>{cls}</option>
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
                  : assignments.filter(a => a.class === selectedClassFilter).length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Pending Submissions</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {filteredAssignments.filter(a => a.status === "Pending").length}
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
                  <tr key={assignment.id} className="transition-colors duration-200 hover:bg-indigo-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.subject}</td>
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
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          onClick={() => deleteAssignment(assignment.id)}
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
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={newAssignment.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      required
                      placeholder="e.g., Mathematics"
                    />
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
                      <p className="text-base font-semibold text-gray-900">{selectedAssignment.class}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Tag size={20} className="text-green-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Subject</h3>
                      <p className="text-base font-semibold text-gray-900">{selectedAssignment.subject}</p>
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">Submissions ({mockSubmissionsData.length})</h3>
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
                      {mockSubmissionsData.map((submission) => (
                        <tr key={submission.id} className="transition-colors duration-200 hover:bg-indigo-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.studentName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.submittedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                              ${submission.status === "Graded" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
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