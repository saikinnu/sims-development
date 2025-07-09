import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Trash2,
  X,
  Pencil,
  BookText, // Icon for Subject
  User, // For individual teacher
  GraduationCap, // Alternative for Subject
  Info, // For info/error alert
  CheckCircle, // For success alert
  Save // Added Save icon
} from 'lucide-react';

const SubjectModule = () => {
  // Sample initial data with teachers
  const initialSubjects = [
    {
      id: 1,
      name: 'Mathematics',
      category: 'Science',
      students: 120, // Keeping this in data, but not displayed in table for simplicity in this UI
      teachers: [
        { empId: 'T101', name: 'Dr. Smith' },
        { empId: 'T102', name: 'Prof. Johnson' }
      ]
    },
    {
      id: 2,
      name: 'Physics',
      category: 'Science',
      students: 85,
      teachers: [
        { empId: 'T103', name: 'Dr. Brown' }
      ]
    },
    {
      id: 3,
      name: 'Literature',
      category: 'Arts',
      students: 65,
      teachers: [
        { empId: 'T104', name: 'Prof. Davis' },
        { empId: 'T105', name: 'Dr. Wilson' }
      ]
    },
    {
      id: 4,
      name: 'History',
      category: 'Humanities',
      students: 90,
      teachers: [
        { empId: 'T106', name: 'Prof. Miller' }
      ]
    },
    {
      id: 5,
      name: 'Computer Science',
      category: 'Technology',
      students: 110,
      teachers: [
        { empId: 'T107', name: 'Dr. Taylor' },
        { empId: 'T108', name: 'Prof. Anderson' }
      ]
    },
  ];

  const [subjects, setSubjects] = useState(() => {
    const storedSubjects = localStorage.getItem('subjects');
    return storedSubjects ? JSON.parse(storedSubjects) : initialSubjects;
  });
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [newSubject, setNewSubject] = useState({
    name: '',
    category: '',
    students: '', // Default to empty string for number input
    teachers: [{ empId: '', name: '' }] // Initialize with one empty teacher
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  // Update localStorage whenever subjects change
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);


  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(subjects.map(subject => subject.category))];

  // Filter and search functionality
  useEffect(() => {
    let results = subjects;

    if (categoryFilter !== 'All') {
      results = results.filter(subject => subject.category === categoryFilter);
    }

    if (searchTerm) {
      results = results.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teachers.some(teacher =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.empId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredSubjects(results);
  }, [searchTerm, categoryFilter, subjects]);

  // Add teacher field in form
  const addTeacherField = () => {
    setNewSubject(prev => ({
      ...prev,
      teachers: [...prev.teachers, { empId: '', name: '' }]
    }));
  };

  // Remove teacher field in form
  const removeTeacherField = (index) => {
    const updatedTeachers = [...newSubject.teachers];
    updatedTeachers.splice(index, 1);
    setNewSubject(prev => ({
      ...prev,
      teachers: updatedTeachers
    }));
  };

  // Handle teacher input change
  const handleTeacherChange = (index, field, value) => {
    const updatedTeachers = [...newSubject.teachers];
    updatedTeachers[index][field] = value;
    setNewSubject(prev => ({
      ...prev,
      teachers: updatedTeachers
    }));
  };

  const resetForm = () => {
    setNewSubject({
      name: '',
      category: '',
      students: '',
      teachers: [{ empId: '', name: '' }]
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  // Add new subject
  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.category) {
      setAlert({ message: 'Subject Name and Category are required.', type: 'error' });
      return;
    }
    // Filter out teachers with empty empId and name for submission
    const validTeachers = newSubject.teachers.filter(t => t.empId && t.name);
    if (validTeachers.length === 0) {
        setAlert({ message: 'At least one teacher (with Employee ID and Name) is required for the subject.', type: 'error' });
        return;
    }

    const subjectToAdd = {
      id: Date.now(), // Use timestamp for unique ID
      name: newSubject.name,
      category: newSubject.category,
      students: parseInt(newSubject.students) || 0, // Ensure students is a number
      teachers: validTeachers
    };
    setSubjects([...subjects, subjectToAdd]);
    setAlert({ message: 'Subject added successfully!', type: 'success' });
    resetForm();
  };

  // Delete subject
  const handleDeleteSubject = (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(subject => subject.id !== id));
      setAlert({ message: 'Subject deleted successfully!', type: 'success' });
    }
  };

  // Edit subject
  const handleEditSubject = (subject) => {
    setEditingId(subject.id);
    setNewSubject({
      name: subject.name,
      category: subject.category,
      students: subject.students.toString(),
      teachers: subject.teachers.length > 0 ? subject.teachers : [{ empId: '', name: '' }] // Ensure at least one field for editing
    });
    setShowAddForm(true);
    setAlert({ message: '', type: '' }); // Clear any previous alerts
  };

  // Update subject
  const handleUpdateSubject = () => {
    if (!newSubject.name || !newSubject.category) {
      setAlert({ message: 'Subject Name and Category are required.', type: 'error' });
      return;
    }
    // Filter out teachers with empty empId and name for submission
    const validTeachers = newSubject.teachers.filter(t => t.empId && t.name);
    if (validTeachers.length === 0) {
        setAlert({ message: 'At least one teacher (with Employee ID and Name) is required for the subject.', type: 'error' });
        return;
    }

    setSubjects(subjects.map(subject =>
      subject.id === editingId ? {
        ...subject,
        name: newSubject.name,
        category: newSubject.category,
        students: parseInt(newSubject.students) || 0,
        teachers: validTeachers
      } : subject
    ));
    setAlert({ message: 'Subject updated successfully!', type: 'success' });
    resetForm();
  };

  // Get background color based on category (adjusting for consistent UI)
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Science': return 'bg-blue-100 text-blue-800';
      case 'Arts': return 'bg-purple-100 text-purple-800';
      case 'Humanities': return 'bg-yellow-100 text-yellow-800';
      case 'Technology': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <BookText className="mr-4 text-indigo-600" size={36} />
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">Subject Management</h1>
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

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search subjects, categories, teachers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-auto">
            <select
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>

          <button
            onClick={() => {
              resetForm(); // Reset form to clear previous edit state
              setShowAddForm(true);
              setAlert({ message: '', type: '' });
            }}
            className="w-full md:w-auto flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="mr-2" size={20} /> Add Subject
          </button>
        </div>

        {/* Add/Edit Subject Form Modal */}
        {showAddForm && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out transform scale-100 opacity-100">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Subject' : 'Add New Subject'}
                </h2>
                <button
                  onClick={() => { setShowAddForm(false); setAlert({ message: '', type: '' }); }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); editingId ? handleUpdateSubject() : handleAddSubject(); }}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">Subject Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="subjectName"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      placeholder="Enter subject name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        id="category"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                        value={newSubject.category}
                        onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value })}
                        required
                      >
                        <option value="" disabled>Select category</option>
                        {categories.filter(cat => cat !== 'All').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teachers <span className="text-red-500">*</span></label>
                    {newSubject.teachers.map((teacher, index) => (
                      <div key={index} className="flex gap-2 mb-3 items-center">
                        <input
                          type="text"
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                          value={teacher.empId}
                          onChange={(e) => handleTeacherChange(index, 'empId', e.target.value)}
                          placeholder="Employee ID"
                        />
                        <input
                          type="text"
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                          value={teacher.name}
                          onChange={(e) => handleTeacherChange(index, 'name', e.target.value)}
                          placeholder="Teacher Name"
                        />
                        {newSubject.teachers.length > 1 && ( // Allow removing only if there's more than one
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
                      {editingId ? 'Save Changes' : 'Add Subject'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subjects Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teachers</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map(subject => (
                  <tr key={subject.id} className="transition-colors duration-200 hover:bg-indigo-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(subject.category)}`}>
                        {subject.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {subject.teachers.length > 0 ? (
                          subject.teachers.map((teacher, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <User size={16} className="mr-1.5 text-gray-500" />
                              <span className="font-medium">{teacher.name}</span>
                              <span className="text-gray-500 ml-1">({teacher.empId})</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm italic">No teachers assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSubject(subject)}
                          className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          title="Edit Subject"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center text-gray-500">
                    No subjects found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default SubjectModule;