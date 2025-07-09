import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  School, // Icon for Class module
  Users, // Icon for strength/students
  User, // For individual teacher
  BookText, // For subjects
  GraduationCap, // Alternative for Class
  Save, // For save button
  CheckCircle, // For success alert
  Info // For info/error alert
} from 'lucide-react';

const ClassModule = () => {
  // Sample data with teachers and subjects
  const initialClasses = [
    {
      id: 1,
      className: '1A',
      strength: 28,
      grade: 'Grade 1',
      supervisor: 'Ms. Anderson',
      teachers: [
        { name: 'Ms. Anderson', empId: 'T001', subjects: ['Mathematics', 'English'] },
        { name: 'Mr. Wilson', empId: 'T005', subjects: ['Science', 'Social Studies'] }
      ]
    },
    {
      id: 2,
      className: '1B',
      strength: 25,
      grade: 'Grade 1',
      supervisor: 'Mr. Baker',
      teachers: [
        { name: 'Mr. Baker', empId: 'T002', subjects: ['Mathematics', 'Physical Education'] },
        { name: 'Ms. Clark', empId: 'T006', subjects: ['Arts', 'Music'] }
      ]
    },
    {
      id: 3,
      className: '2A',
      strength: 32,
      grade: 'Grade 2',
      supervisor: 'Dr. Evans',
      teachers: [
        { name: 'Dr. Evans', empId: 'T003', subjects: ['Physics', 'Chemistry'] },
        { name: 'Ms. Green', empId: 'T007', subjects: ['Biology'] }
      ]
    },
    {
      id: 4,
      className: '3B',
      strength: 29,
      grade: 'Grade 3',
      supervisor: 'Prof. Hill',
      teachers: [
        { name: 'Prof. Hill', empId: 'T004', subjects: ['History', 'Geography'] },
        { name: 'Mr. White', empId: 'T008', subjects: ['Computer Science'] }
      ]
    },
    {
      id: 5,
      className: '4C',
      strength: 30,
      grade: 'Grade 4',
      supervisor: 'Ms. King',
      teachers: [
        { name: 'Ms. King', empId: 'T009', subjects: ['Advanced Math', 'Literature'] }
      ]
    },
  ];

  const [classes, setClasses] = useState(() => {
    const storedClasses = localStorage.getItem('classes');
    return storedClasses ? JSON.parse(storedClasses) : initialClasses;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [newClass, setNewClass] = useState({
    className: '',
    strength: '',
    grade: '',
    supervisor: '',
    teachers: [{ name: '', empId: '', subjects: '' }]
  });
  const [alert, setAlert] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  // Update localStorage whenever classes change
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  // Color mapping for different grades
  const gradeColors = {
    'Grade 1': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Grade 2': { bg: 'bg-green-100', text: 'text-green-800' },
    'Grade 3': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'Grade 4': { bg: 'bg-purple-100', text: 'text-purple-800' },
    // Add more grades as needed
    'Default': { bg: 'bg-gray-100', text: 'text-gray-800' },
  };

  const getGradeDisplay = (grade) => {
    return gradeColors[grade] || gradeColors['Default'];
  };

  // Filter classes based on search term
  useEffect(() => {
    const results = classes.filter(
      (cls) =>
        cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teachers.some(teacher =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );
    setFilteredClasses(results);
  }, [searchTerm, classes]);

  const resetForm = () => {
    setNewClass({
      className: '',
      strength: '',
      grade: '',
      supervisor: '',
      teachers: [{ name: '', empId: '', subjects: '' }]
    });
    setEditingClassId(null);
    setIsAddEditModalOpen(false);
  };

  // Handle add teacher field in form
  const addTeacherField = () => {
    setNewClass(prev => ({
      ...prev,
      teachers: [...prev.teachers, { name: '', empId: '', subjects: '' }]
    }));
  };

  // Handle remove teacher field in form
  const removeTeacherField = (index) => {
    const updatedTeachers = [...newClass.teachers];
    updatedTeachers.splice(index, 1);
    setNewClass(prev => ({
      ...prev,
      teachers: updatedTeachers
    }));
  };

  // Handle teacher input change
  const handleTeacherChange = (index, field, value) => {
    const updatedTeachers = [...newClass.teachers];
    updatedTeachers[index][field] = value;
    setNewClass(prev => ({
      ...prev,
      teachers: updatedTeachers
    }));
  };

  // Handle add/update class submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newClass.className || !newClass.grade || !newClass.supervisor || !newClass.strength) {
      setAlert({ message: 'Please fill in all required class details.', type: 'error' });
      return;
    }

    // Validate teachers
    const validTeachers = newClass.teachers.filter(t => t.name && t.empId && t.subjects);
    if (validTeachers.length === 0 && newClass.teachers.length > 0 && (newClass.teachers[0].name || newClass.teachers[0].empId || newClass.teachers[0].subjects)) {
      setAlert({ message: 'Please ensure all teacher fields (Name, Employee ID, Subjects) are filled for each teacher, or remove empty teacher entries.', type: 'error' });
      return;
    }

    if (editingClassId) {
      // Update existing class
      setClasses(classes.map(cls =>
        cls.id === editingClassId ? {
          ...cls,
          className: newClass.className,
          strength: parseInt(newClass.strength),
          grade: newClass.grade,
          supervisor: newClass.supervisor,
          teachers: validTeachers.map(t => ({ ...t, subjects: t.subjects.split(',').map(s => s.trim()).filter(Boolean) }))
        } : cls
      ));
      setAlert({ message: 'Class updated successfully!', type: 'success' });
    } else {
      // Add new class
      const classToAdd = {
        id: Date.now(),
        className: newClass.className,
        strength: parseInt(newClass.strength),
        grade: newClass.grade,
        supervisor: newClass.supervisor,
        teachers: validTeachers.map(t => ({ ...t, subjects: t.subjects.split(',').map(s => s.trim()).filter(Boolean) }))
      };
      setClasses([...classes, classToAdd]);
      setAlert({ message: 'Class added successfully!', type: 'success' });
    }
    resetForm();
  };

  // Handle view class profile
  const handleViewProfile = (classId) => {
    const selected = classes.find(cls => cls.id === classId);
    setSelectedClass(selected);
    setIsViewModalOpen(true);
  };

  // Handle edit class
  const handleEdit = (classId) => {
    const classToEdit = classes.find(cls => cls.id === classId);
    setEditingClassId(classId);
    setNewClass({
      className: classToEdit.className,
      strength: classToEdit.strength.toString(),
      grade: classToEdit.grade,
      supervisor: classToEdit.supervisor,
      teachers: classToEdit.teachers.length > 0
        ? classToEdit.teachers.map(t => ({ ...t, subjects: t.subjects.join(', ') }))
        : [{ name: '', empId: '', subjects: '' }]
    });
    setIsAddEditModalOpen(true);
    setAlert({ message: '', type: '' }); // Clear any previous alerts
  };

  // Handle delete class
  const handleDelete = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter((cls) => cls.id !== classId));
      setAlert({ message: 'Class deleted successfully!', type: 'success' });
    }
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedClass(null);
  };

  const uniqueGrades = ['All', ...new Set(initialClasses.map(c => c.grade))];


  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <School className="mr-4 text-indigo-600" size={36} />
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">Class Management</h1>
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

        {/* Search and Add New Class */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 items-center">
          <div className="relative flex-grow w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search classes (1A, Grade 1, Teacher Name)..."
              className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => { resetForm(); setIsAddEditModalOpen(true); setAlert({ message: '', type: '' }); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle size={20} /> Add New Class
          </button>
        </div>

        {/* Classes Table */}
        <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Strength</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">{cls.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users size={18} className="mr-2 text-gray-500" />
                        <div className="h-2 w-20 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${(cls.strength / 35) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{cls.strength}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeDisplay(cls.grade).bg} ${getGradeDisplay(cls.grade).text}`}>
                        {cls.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cls.supervisor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProfile(cls.id)}
                          className="p-2.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          title="View Profile"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEdit(cls.id)}
                          className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls.id)}
                          className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-sm text-gray-500">
                    No classes found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Class Modal */}
        {isAddEditModalOpen && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out transform scale-100 opacity-100">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingClassId ? 'Edit Class' : 'Add New Class'}
                </h2>
                <button
                  onClick={() => { resetForm(); setAlert({ message: '', type: '' }); }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">Class Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="className"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      value={newClass.className}
                      onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                      placeholder="e.g., 1A, 2B"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-1">Strength <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      id="strength"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      value={newClass.strength}
                      onChange={(e) => setNewClass({ ...newClass, strength: e.target.value })}
                      placeholder="Number of students"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        id="grade"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                        value={newClass.grade}
                        onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                        required
                      >
                        <option value="" disabled>Select Grade</option>
                        {uniqueGrades.filter(g => g !== 'All').map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700 mb-1">Supervisor <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="supervisor"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      value={newClass.supervisor}
                      onChange={(e) => setNewClass({ ...newClass, supervisor: e.target.value })}
                      placeholder="e.g., Ms. Jane Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teachers <span className="text-red-500">*</span></label>
                    {newClass.teachers.map((teacher, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 items-center">
                        <input
                          type="text"
                          className="px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                          value={teacher.name}
                          onChange={(e) => handleTeacherChange(index, 'name', e.target.value)}
                          placeholder="Teacher Name"
                          required
                        />
                        <input
                          type="text"
                          className="px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                          value={teacher.empId}
                          onChange={(e) => handleTeacherChange(index, 'empId', e.target.value)}
                          placeholder="Employee ID"
                          required
                        />
                          <input
                            type="text"
                            className="flex-grow px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                            value={teacher.subjects}
                            onChange={(e) => handleTeacherChange(index, 'subjects', e.target.value)}
                            placeholder="Subjects (comma-separated)"
                            required
                          />
                          {newClass.teachers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeacherField(index)}
                              className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                              title="Remove Teacher"
                            >
                              <X size={20} />
                            </button>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTeacherField}
                      className="mt-1 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                      <PlusCircle size={18} /> Add Another Teacher
                    </button>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => { resetForm(); setAlert({ message: '', type: '' }); }}
                      className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
                    >
                      <X className="mr-2" size={20} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                    >
                      <Save className="mr-2" size={20} />
                      {editingClassId ? 'Save Changes' : 'Add Class'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Class Details Modal */}
        {isViewModalOpen && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 opacity-100 transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedClass.className} - {selectedClass.grade} Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                      <Info size={22} className="mr-2 text-indigo-600" /> Class Information
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p><span className="font-medium">Class Name:</span> {selectedClass.className}</p>
                      <p><span className="font-medium">Grade:</span> {selectedClass.grade}</p>
                      <p><span className="font-medium">Students:</span> {selectedClass.strength}</p>
                      <p><span className="font-medium">Supervisor:</span> {selectedClass.supervisor}</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-100">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                      <Users size={22} className="mr-2 text-purple-600" /> Class Statistics
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p><span className="font-medium">Capacity:</span> 35 students</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-indigo-500 h-2.5 rounded-full"
                          style={{ width: `${(selectedClass.strength / 35) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm pt-1">{selectedClass.strength} / 35 students enrolled</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <h3 className="font-semibold text-lg p-4 bg-yellow-50 border-b border-yellow-100 text-gray-800 flex items-center">
                    <GraduationCap size={22} className="mr-2 text-yellow-700" /> Teachers & Subjects
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {selectedClass.teachers.length > 0 ? (
                      selectedClass.teachers.map((teacher, index) => (
                        <div key={index} className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-2 sm:mb-0">
                              <h4 className="font-medium text-gray-800 flex items-center">
                                <User size={18} className="mr-2 text-gray-600" /> {teacher.name}
                              </h4>
                              <p className="text-sm text-gray-600 ml-7">Employee ID: {teacher.empId}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {teacher.subjects.map((subject, subIndex) => (
                                <span
                                  key={subIndex}
                                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 flex items-center"
                                >
                                  <BookText size={14} className="mr-1" /> {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm italic">
                        No teachers assigned to this class.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t border-gray-100">
                <button
                  onClick={closeModal}
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

export default ClassModule;