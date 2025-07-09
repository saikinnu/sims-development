import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material'; // Keeping some MUI components that are hard to replicate quickly with Tailwind, like Card, CardContent, Avatar, IconButton, and Dialogs.
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  Edit,
  Trash,
  Plus,
  Filter,
  X,
  Search,
  Users, // Equivalent to GroupIcon for total students
  CheckCircle, // For active status
  PauseCircle, // For inactive status
  Award, // For graduated status (similar to EmojiEventsIcon)
  IdCard, // For Student ID (similar to BadgeIcon)
  Mail, // For Email
  Phone, // For Phone
  User, // For Name
  Hash, // For Roll Number (similar to NumbersIcon)
  BookOpen, // For Class (similar to SchoolIcon)
  Home, // For Address
  Key, // For Password/Authentication (similar to LockIcon)
} from 'lucide-react'; // Using lucide-react for consistent icons
import Select from 'react-select'; // For better customizable select dropdowns

const StudentModule = () => {
  // Sample data - replace with actual API calls
  const [students, setStudents] = useState([
    {
      id: 1,
      studentId: 'S001',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=1',
      name: 'John Doe',
      rollNumber: 'R001',
      email: 'john@example.com',
      class: '10th',
      contact: '1234567890',
      parent: 'Jane Doe',
      status: 'active',
      address: '123 Main St, Anytown',
    },
    {
      id: 2,
      studentId: 'S002',
      password: 'password456',
      avatar: 'https://i.pravatar.cc/150?img=2',
      name: 'Alice Smith',
      rollNumber: 'R002',
      email: 'alice@example.com',
      class: '9th',
      contact: '9876543210',
      parent: 'Bob Smith',
      status: 'inactive',
      address: '456 Oak Ave, Anytown',
    },
    {
      id: 3,
      studentId: 'S003',
      password: 'password789',
      avatar: 'https://i.pravatar.cc/150?img=3',
      name: 'Michael Johnson',
      rollNumber: 'R003',
      email: 'michael@example.com',
      class: '12th',
      contact: '4561237890',
      parent: 'Sarah Johnson',
      status: 'graduated',
      address: '789 Pine Ln, Anytown',
    },
    {
      id: 4,
      studentId: 'S004',
      password: 'password101',
      avatar: 'https://i.pravatar.cc/150?img=4',
      name: 'Emily Davis',
      rollNumber: 'R004',
      email: 'emily@example.com',
      class: '10th',
      contact: '1122334455',
      parent: 'David Davis',
      status: 'active',
      address: '101 Elm St, Otherville',
    },
  ]);

  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'all',
    class: 'all',
    studentId: '', // Added for specific student ID filter
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);


  // Calculate totals
  const totalStudents = students.length;
  const totalActive = students.filter(s => s.status === 'active').length;
  const totalInactive = students.filter(s => s.status === 'inactive').length;
  const totalGraduated = students.filter(s => s.status === 'graduated').length;

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      class: 'all',
      studentId: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(f => f && f !== 'all').length;


  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const { searchQuery, status, class: selectedClass, studentId } = filters;

    const matchesSearch =
      searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = status === 'all' || student.status === status;
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStudentId = studentId === '' || student.studentId.toLowerCase().includes(studentId.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesClass && matchesStudentId;
  });

  // Handle delete student
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  // Classes for dropdown - you might want to fetch these from an API
  const classes = ['9th', '10th', '11th', '12th'];
  const classOptions = [{ value: 'all', label: 'All Classes' }, ...classes.map(cls => ({ value: cls, label: cls }))];
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
  ];

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentId: '',
    password: '',
    name: '',
    rollNumber: '',
    email: '',
    class: '',
    contact: '',
    parent: '',
    status: 'active',
    avatar: '',
    address: '',
  });
  const [viewStudent, setViewStudent] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Handle new student submission
  const handleAddStudent = () => {
    const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    setStudents([...students, { id, ...newStudent }]);
    setOpenAddModal(false);
    setNewStudent({ // Reset form
      studentId: '',
      password: '',
      name: '',
      rollNumber: '',
      email: '',
      class: '',
      contact: '',
      parent: '',
      status: 'active',
      avatar: '',
      address: '',
    });
  };

  // Handle update student (from view/edit modal)
  const handleUpdateStudent = () => {
    setStudents(prev => prev.map(s => s.id === viewStudent.id ? {
      ...viewStudent,
      password: viewStudent.newPassword ? viewStudent.newPassword : s.password, // Update password if new one is provided
      newPassword: undefined // Clear temporary newPassword field
    } : s));
    setOpenViewModal(false);
    setEditMode(false);
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8 bg-[#F1F0FF]/50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <Card className="relative h-full bg-gradient-to-br from-white to-lamaSkyLight rounded-[30px] overflow-hidden border-2 border-lamaSky/20 shadow-md">
          <CardContent className="p-8">
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 rounded-[20px] bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-lamaSky/20">
                <Users size={32} className="text-lamaSky" /> {/* Lucide icon */}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-lamaSky animate-pulse" />
                <span className="text-xs font-medium text-gray-500">All Students</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Total Students</h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-4 border border-lamaSky/20">
                <p className="text-4xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative h-full bg-gradient-to-br from-white to-lamaPurpleLight rounded-[30px] overflow-hidden border-2 border-lamaPurple/20 shadow-md">
          <CardContent className="p-8">
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 rounded-[20px] bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-lamaPurple/20">
                <CheckCircle size={32} className="text-lamaPurple" /> {/* Lucide icon */}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-lamaPurple animate-pulse" />
                <span className="text-xs font-medium text-gray-500">Currently Active</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Active</h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-4 border border-lamaPurple/20">
                <p className="text-4xl font-bold text-gray-900">{totalActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative h-full bg-gradient-to-br from-white to-lamaYellowLight rounded-[30px] overflow-hidden border-2 border-lamaYellow/20 shadow-md">
          <CardContent className="p-8">
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 rounded-[20px] bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-lamaYellow/20">
                <PauseCircle size={32} className="text-lamaYellow" /> {/* Lucide icon */}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-lamaYellow animate-pulse" />
                <span className="text-xs font-medium text-gray-500">On Hold</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Inactive</h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-4 border border-lamaYellow/20">
                <p className="text-4xl font-bold text-gray-900">{totalInactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative h-full bg-gradient-to-br from-white to-lamaSkyLight rounded-[30px] overflow-hidden border-2 border-lamaSky/20 shadow-md">
          <CardContent className="p-8">
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 rounded-[20px] bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-lamaSky/20">
                <Award size={32} className="text-lamaSky" /> {/* Lucide icon */}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-lamaSky animate-pulse" />
                <span className="text-xs font-medium text-gray-500">Completed</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Graduated</h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-4 border border-lamaSky/20">
                <p className="text-4xl font-bold text-gray-900">{totalGraduated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Search and Buttons */}
      <div className='flex justify-between items-center mb-4'>
        {/* Search Bar - Desktop */}
        <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full md:w-[400px]'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, Name, Email, Phone, Address..."
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
        <div className='flex gap-2 ml-auto'> {/* ml-auto pushes buttons to the right */}
          {/* Mobile Search Button */}
          <button
            className='md:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md text-sm'
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search size={16} />
            Search
          </button>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
              showFilters || activeFilterCount > 0
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
            onClick={() => setOpenAddModal(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <Plus size={16} className='mr-2' />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className='md:hidden flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full mb-4 animate-fade-in'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, Name, Email, Phone, Address..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                placeholder="Filter by Student ID"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.studentId}
                onChange={(e) => handleFilterChange('studentId', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <Select
                options={classOptions}
                value={classOptions.find(option => option.value === filters.class)}
                onChange={(selected) => handleFilterChange('class', selected ? selected.value : 'all')}
                placeholder="Select Class..."
                isClearable
                className="basic-select"
                classNamePrefix="select"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                options={statusOptions}
                value={statusOptions.find(option => option.value === filters.status)}
                onChange={(selected) => handleFilterChange('status', selected ? selected.value : 'all')}
                placeholder="Select Status..."
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

      {/* Students Table */}
      <div className="bg-white border border-gray-200 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Roll No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Parent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Avatar
                        alt={student.name}
                        src={student.avatar}
                        sx={{ width: 32, height: 32 }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words">
                      {student.contact}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words">
                      {student.parent}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words">
                      <span className={`
                        px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${student.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        ${student.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${student.status === 'graduated' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50"
                          size="small"
                          onClick={() => { setViewStudent(student); setOpenViewModal(true); setEditMode(false); }}
                          title="View"
                        >
                          <Search size={16} />
                        </IconButton>
                        <IconButton
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                          size="small"
                          onClick={() => { setViewStudent(student); setOpenViewModal(true); setEditMode(true); }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </IconButton>
                        <IconButton
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          size="small"
                          onClick={() => handleDelete(student.id)}
                          title="Delete"
                        >
                          <Trash size={16} />
                        </IconButton>
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
                        {students.length === 0 ? 'No students yet!' : 'No matching students found.'}
                      </h3>
                      <p className='mt-1 text-sm text-gray-600'>
                        {students.length === 0 ? 'Get started by adding a new student record' :
                          'Try adjusting your search or filter criteria'}
                      </p>
                      {students.length === 0 && (
                        <button
                          onClick={() => setOpenAddModal(true)}
                          className='mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                        >
                          <Plus size={20} className='mr-2' />
                          Add Student
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

      {/* Add Student Modal */}
      <Dialog className='backdrop-blur-sm' open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center pr-2">
          <span className="text-xl font-semibold text-gray-800">Add New Student</span>
          <IconButton onClick={() => setOpenAddModal(false)} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="py-6 px-4">
          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-2">
              <Avatar
                src={newStudent.avatar}
                alt={newStudent.name || 'Student Photo'}
                sx={{ width: 80, height: 80 }}
                className="shadow-md"
              />
              <button
                type="button"
                onClick={() => document.getElementById('newStudentPhotoInput').click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Upload Photo
                <input
                  id="newStudentPhotoInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setNewStudent(prev => ({ ...prev, avatar: ev.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </button>
            </div>
            {/* End Photo Upload */}
            <input
              type="text"
              placeholder="Student ID"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.studentId}
              onChange={e => setNewStudent({ ...newStudent, studentId: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.password}
              onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
            />
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.name}
              onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Roll Number"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.rollNumber}
              onChange={e => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.email}
              onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
            />
            <Select
              options={classOptions.filter(opt => opt.value !== 'all')} // Exclude "All Classes" from add/edit
              value={classOptions.find(option => option.value === newStudent.class)}
              onChange={selected => setNewStudent({ ...newStudent, class: selected ? selected.value : '' })}
              placeholder="Select Class"
              classNamePrefix="select"
            />
            <input
              type="text"
              placeholder="Contact"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.contact}
              onChange={e => setNewStudent({ ...newStudent, contact: e.target.value })}
            />
            <input
              type="text"
              placeholder="Parent"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.parent}
              onChange={e => setNewStudent({ ...newStudent, parent: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newStudent.address}
              onChange={e => setNewStudent({ ...newStudent, address: e.target.value })}
            />
            <Select
              options={statusOptions.filter(opt => opt.value !== 'all')} // Exclude "All Status" from add/edit
              value={statusOptions.find(option => option.value === newStudent.status)}
              onChange={selected => setNewStudent({ ...newStudent, status: selected ? selected.value : 'active' })}
              placeholder="Select Status"
              classNamePrefix="select"
            />
          </div>
        </DialogContent>
        <DialogActions className="p-4 flex justify-end gap-2">
          <button
            onClick={() => setOpenAddModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddStudent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Student
          </button>
        </DialogActions>
      </Dialog>

      {/* View/Edit Student Modal */}
      <Dialog open={openViewModal} onClose={() => { setOpenViewModal(false); setEditMode(false); }} maxWidth="xs" fullWidth>
        <div className="relative bg-gradient-to-br from-[#CFCEFF] to-[#EDF9FD] rounded-t-lg pt-4">
          <div className="absolute right-4 top-4 z-10">
            <IconButton onClick={() => { setOpenViewModal(false); setEditMode(false); }} size="small" className="bg-white/80 hover:bg-white rounded-full p-1 shadow">
              <X size={20} />
            </IconButton>
          </div>
          <div className="flex flex-col items-center pt-4 pb-2">
            <div className="relative mb-4">
              <Avatar
                src={viewStudent?.avatar}
                alt={viewStudent?.name || 'Student Photo'}
                sx={{ width: 100, height: 100, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              {editMode && (
                <button
                  type="button"
                  onClick={() => document.getElementById('editStudentPhotoInput').click()}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-colors"
                  title="Change Photo"
                >
                  <Edit size={16} />
                  <input
                    id="editStudentPhotoInput"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          setViewStudent(prev => ({ ...prev, avatar: ev.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </button>
              )}
              <span className="absolute -bottom-2 right-0">
                {viewStudent?.status === 'active' && <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200"><CheckCircle size={14} /> Active</span>}
                {viewStudent?.status === 'inactive' && <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200"><PauseCircle size={14} /> Inactive</span>}
                {viewStudent?.status === 'graduated' && <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"><Award size={14} /> Graduated</span>}
              </span>
            </div>
            <div className="mt-2 text-xl font-bold text-gray-800">{viewStudent?.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-1"><Mail size={14} /> {viewStudent?.email}</div>
          </div>
        </div>
        <DialogContent dividers className="bg-white rounded-b-lg shadow-lg px-4 pt-6 pb-2">
          {viewStudent && (
            <form onSubmit={e => {
              e.preventDefault();
              if (editMode) {
                handleUpdateStudent();
              }
            }}>
              <div className="flex flex-col gap-5">
                {/* Authentication Section */}
                <div>
                  <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-lg"><Key size={18} className="text-blue-500" /> Authentication</div>
                  <div className="grid grid-cols-1 gap-3 text-gray-700">
                    {editMode ? (
                      <>
                        <label className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.studentId}
                          onChange={e => setViewStudent({ ...viewStudent, studentId: e.target.value })}
                        />
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          type="password"
                          className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md outline-none cursor-not-allowed"
                          value={viewStudent.password || ''}
                          readOnly
                          disabled
                        />
                        <label className="block text-sm font-medium text-gray-700">Change Password</label>
                        <input
                          type="password"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.newPassword || ''}
                          onChange={e => setViewStudent({ ...viewStudent, newPassword: e.target.value })}
                          placeholder="Leave blank to keep current password"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2"><IdCard size={16} className="text-blue-400" /><span className="font-medium">Student ID:</span> <span className="text-gray-800">{viewStudent.studentId}</span></div>
                        <div className="flex items-center gap-2"><Key size={16} className="text-blue-400" /><span className="font-medium">Password:</span> <span className="text-gray-800">{viewStudent.password ? '••••••••' : '-'}</span></div>
                      </>
                    )}
                  </div>
                </div>
                <hr className="border-t border-gray-200" />
                {/* Basic Information Section */}
                <div>
                  <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-lg"><User size={18} className="text-blue-500" /> Basic Information</div>
                  <div className="grid grid-cols-1 gap-3 text-gray-700">
                    {editMode ? (
                      <>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.name}
                          onChange={e => setViewStudent({ ...viewStudent, name: e.target.value })}
                        />
                        <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.rollNumber}
                          onChange={e => setViewStudent({ ...viewStudent, rollNumber: e.target.value })}
                        />
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.email}
                          onChange={e => setViewStudent({ ...viewStudent, email: e.target.value })}
                        />
                        <label className="block text-sm font-medium text-gray-700">Class</label>
                        <Select
                          options={classOptions.filter(opt => opt.value !== 'all')}
                          value={classOptions.find(option => option.value === viewStudent.class)}
                          onChange={selected => setViewStudent({ ...viewStudent, class: selected ? selected.value : '' })}
                          placeholder="Select Class"
                          classNamePrefix="select"
                        />
                        <label className="block text-sm font-medium text-gray-700">Contact</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.contact}
                          onChange={e => setViewStudent({ ...viewStudent, contact: e.target.value })}
                        />
                        <label className="block text-sm font-medium text-gray-700">Parent</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.parent}
                          onChange={e => setViewStudent({ ...viewStudent, parent: e.target.value })}
                        />
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                          value={viewStudent.address}
                          onChange={e => setViewStudent({ ...viewStudent, address: e.target.value })}
                        />
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <Select
                          options={statusOptions.filter(opt => opt.value !== 'all')}
                          value={statusOptions.find(option => option.value === viewStudent.status)}
                          onChange={selected => setViewStudent({ ...viewStudent, status: selected ? selected.value : 'active' })}
                          placeholder="Select Status"
                          classNamePrefix="select"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2"><Hash size={16} className="text-blue-400" /><span className="font-medium">Roll Number:</span> <span className="text-gray-800">{viewStudent.rollNumber}</span></div>
                        <div className="flex items-center gap-2"><BookOpen size={16} className="text-blue-400" /><span className="font-medium">Class:</span> <span className="text-gray-800">{viewStudent.class}</span></div>
                        <div className="flex items-center gap-2"><Phone size={16} className="text-blue-400" /><span className="font-medium">Contact:</span> <span className="text-gray-800">{viewStudent.contact}</span></div>
                        <div className="flex items-center gap-2"><Users size={16} className="text-blue-400" /><span className="font-medium">Parent:</span> <span className="text-gray-800">{viewStudent.parent}</span></div>
                        <div className="flex items-center gap-2"><Home size={16} className="text-blue-400" /><span className="font-medium">Address:</span> <span className="text-gray-800">{viewStudent.address}</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {editMode && (
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => { setEditMode(false); setOpenViewModal(false); }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentModule;