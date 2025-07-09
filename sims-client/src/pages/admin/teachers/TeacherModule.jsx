import React, { useState, useEffect } from 'react'; // Import useEffect
import AddTeacher from './AddTeacher';
import TeacherDetails from './TeacherDetails';
import { Edit, Trash, Plus, Filter, X, Search } from 'lucide-react';
import Select from 'react-select';
import axios from 'axios'; // Import axios

function TeacherModule() {
  const [teachers, setTeachers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filters, setFilters] = useState({
    empId: '',
    subject: null,
    class: null,
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New state for mobile search
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Derive options dynamically from existing teachers, safely handling undefined subjects/classes
  const allSubjects = Array.from(new Set(teachers.flatMap(t => t.subject || []))).sort();
  const subjectOptions = allSubjects.map(sub => ({ value: sub, label: sub }));

  const allClasses = Array.from(new Set(teachers.flatMap(t => t.classes || []))).sort();
  const classOptions = allClasses.map(cls => ({ value: cls, label: cls }));

  // useEffect to fetch teachers when the component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/teachers/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Assuming the API returns an array of teacher objects
        setTeachers(response.data);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to fetch teachers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleAddTeacher = (data) => {
    setTeachers([...teachers, data]);
  };

  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditMode(false);
    setShowDetailsModal(true);
  };

  const handleEdit = (teacher) => {
      setSelectedTeacher(teacher);
      setIsEditMode(true);
      setShowDetailsModal(true);
  };

  const handleUpdate = (updated) => {
    setTeachers(teachers.map((t) => (t.empId === updated.empId ? updated : t)));
  };

  const handleDelete = async (id) => {
    // In a real application, you'd also make an API call here to delete from the backend
    if (window.confirm('Are you sure you want to delete this teacher record?')) {
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        if (!token) {
          console.error('Authentication token not found.');
          return;
        }

        await axios.delete(`http://localhost:5000/api/teachers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(teachers.filter((t) => t.id !== id));
      } catch (err) {
        console.error('Error deleting teacher:', err);
        // Handle error, e.g., show a user-friendly message
      }
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      empId: '',
      subject: null,
      class: null,
      searchQuery: ''
    });
  };

  // Calculate active filter count for the badge
  const activeFilterCount = Object.values(filters).filter(f => f && (typeof f !== 'object' || (f && f.value))).length;

  const filteredTeachers = teachers.filter(teacher => {
    // Safely access properties before calling toLowerCase()
    const teacherEmpId = teacher.user_id?.toLowerCase() || '';
    const teacherName = teacher.full_name?.toLowerCase() || '';
    const teacherEmail = teacher.email?.toLowerCase() || '';
    const teacherPhone = teacher.phone?.toLowerCase() || '';
    const teacherAddress = teacher.address?.toLowerCase() || '';
    const teacherClassTeacher = teacher.classTeacher?.toLowerCase() || '';


    if (filters.empId && !teacherEmpId.includes(filters.empId.toLowerCase())) return false;
    // Safely check if subject includes the filter value
    if (filters.subject && !(teacher.subject || []).includes(filters.subject.value)) return false;
    // Safely check if classes includes the filter value
    if (filters.class && !(teacher.classes || []).includes(filters.class.value)) return false;

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchFields = [
        teacherEmpId,
        teacherName,
        teacherEmail,
        teacherPhone,
        teacherAddress,
        // Safely map and join subjects and classes for search
        (teacher.subject || []).map(s => s.toLowerCase()).join(' '),
        (teacher.classes || []).map(c => c.toLowerCase()).join(' '),
        teacherClassTeacher
      ];
      return searchFields.some(field => field.includes(query));
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading teachers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Header */}
      <div className='flex justify-between mb-4'>
        {/* Search Bar - Desktop */}
        <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full md:w-[400px]'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, Name, Subject, Class, Email..."
            className="p-2 bg-transparent outline-none flex-1 min-w-0"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className='flex gap-2'>
          {/* Mobile Search Button */}
          <button
            className='md:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md text-sm'
            onClick={() => setShowMobileSearch(!showMobileSearch)} // Toggle mobile search visibility
          >
            <Search size={16} />
            Search
          </button>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${showFilters || activeFilterCount > 0
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100'
              }`}
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
            <span className="hidden md:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0 md:ml-1 inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <Plus size={16} className='mr-2' />
            <span>Add Teacher</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className='md:hidden flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full mb-4 animate-fade-in'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, Name, Subject, Class, Email..."
            className="p-2 bg-transparent outline-none flex-1 min-w-0"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EMP ID</label>
              <input
                type="text"
                placeholder="Filter by EMP ID"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.empId}
                onChange={(e) => handleFilterChange('empId', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Select
                options={subjectOptions}
                value={filters.subject}
                onChange={(selected) => handleFilterChange('subject', selected)}
                placeholder="Select subject..."
                isClearable
                className="basic-select"
                classNamePrefix="select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <Select
                options={classOptions}
                value={filters.class}
                onChange={(selected) => handleFilterChange('class', selected)}
                placeholder="Select class..."
                isClearable
                className="basic-select"
                classNamePrefix="select"
              />
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <button
              onClick={clearFilters}
              className='text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors duration-200'
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  EMP ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Class Teacher
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Address
                </th>
                <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm font-medium text-gray-900 break-words'>
                      {teacher.user_id}
                      {console.log('teacher id is :', teacher.user_id)}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 break-words'>
                      <div className='flex items-center gap-2'>
                        {/* {teacher.image && <img src={teacher.image} alt='Teacher Avatar' className='w-8 h-8 rounded-full object-cover' />} */}
                        {teacher.full_name}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 break-all'>
                      {teacher.email}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 break-words'>
                      {teacher.phone}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 break-words'>
                      {(teacher.subjects_taught || []).join(', ')}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 break-words'>
                      {(teacher.assigned_classes || []).join(', ')}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 break-words'>
                      {teacher.class_teacher || '-'}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 break-words'>
                      {teacher.address}
                    </td>
                    <td className='px-6 py-4 text-right text-sm font-medium'>
                      <div className="flex items-center justify-end gap-2">
                        <span
                          onClick={() => handleView(teacher)}
                          className='text-blue-600 cursor-pointer hover:text-blue-800 text-lg'
                          title="View"
                        >
                          👁️
                        </span>
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search size={40} className='mb-3 text-gray-400' />
                      <h3 className='text-lg font-semibold mb-1'>
                        {teachers.length === 0 ? 'No teachers yet!' : 'No matching teachers found.'}
                      </h3>
                      <p className='mt-1 text-sm text-gray-600'>
                        {teachers.length === 0 ? 'Get started by adding a new teacher record' :
                          'Try adjusting your search or filter criteria'}
                      </p>
                      {teachers.length === 0 && (
                        <button
                          onClick={() => setShowAddModal(true)}
                          className='mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                        >
                          <Plus size={20} className='mr-2' />
                          Add Teacher
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTeacher
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTeacher}
          existingTeachers={teachers}
        />
      )}

      {showDetailsModal && (
        <TeacherDetails
          onClose={() => setShowDetailsModal(false)}
          data={selectedTeacher}
          editable={isEditMode}
          onUpdate={handleUpdate}
          existingTeachers={teachers}
        />
      )}
    </div>
  );
}

export default TeacherModule;
