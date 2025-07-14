// StudentModule.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material'; // Keeping some MUI components that are hard to replicate quickly with Tailwind, like Card, CardContent, Avatar, IconButton, and Dialogs.
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
  Calendar, // For Date of Birth
  Venus, // For Gender (similar to GenderMale/Female)
  Briefcase, // For Student Type
  School, // For Previous School Details
  Paperclip, // For Documents (similar to AttachFileIcon)
  FileText, // For general document icon
  Download, // For download icon
} from 'lucide-react'; // Using lucide-react for consistent icons
import Select from 'react-select'; // For better customizable select dropdowns

// Import the new components
import AddStudent from './AddStudent';
import StudentDetails from './StudentDetails';

const StudentModule = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'all',
    class: 'all',
    studentId: '', // Added for specific student ID filter
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null); // Renamed from selectedStudent for clarity in StudentDetails
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);


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
    const { searchQuery, status, class: selectedClass, studentId: filterStudentId } = filters; // Renamed studentId to filterStudentId to avoid conflict

    const matchesSearch =
      searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()); // Use searchQuery here as well

    const matchesStatus = status === 'all' || student.status === status;
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStudentId = filterStudentId === '' || student.studentId.toLowerCase().includes(filterStudentId.toLowerCase());

    return matchesSearch && matchesStatus && matchesClass && matchesStudentId;
  });

  // Handle delete student
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        if (!token) {
          console.error("No token found");
          return;
        }
        await axios.delete(`http://localhost:5000/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setStudents(students.filter(student => student.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  // Classes for dropdown - you might want to fetch these from an API
  const classOptions = [
    { value: 'all', label: 'All Classes' },
    ...classes.map(cls => ({ value: cls._id, label: cls.class_name }))
  ];
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get('http://localhost:5000/api/students/', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        // Transform the data to match your frontend structure
        const formattedStudents = response.data.map(student => ({
          id: student._id,
          studentId: student.user_id,
          name: student.full_name,
          rollNumber: student.admission_number,
          email: student.email,
          class: student.class_id,
          contact: student.contact || '',
          parent: student.parent_id?.[0] || '',
          status: 'active',
          address: student.address,
          avatar: student.profile_image?.url || '',
          gender: student.gender || '',
          dateOfBirth: student.date_of_birth ? new Date(student.date_of_birth).toISOString().split('T')[0] : '',
          studentType: student.student_type || 'Current Student',
          previousSchoolName: student.previous_school_name || '',
          previousSchoolAddress: student.previous_school_address || '',
          previousSchoolPhoneNumber: student.previous_school_phone_number || '',
          previousSchoolStartDate: student.previous_school_start_date ? new Date(student.previous_school_start_date).toISOString().split('T')[0] : '',
          previousSchoolEndDate: student.previous_school_end_date ? new Date(student.previous_school_end_date).toISOString().split('T')[0] : '',
          documents: student.documents || [],
        }));
        setStudents(formattedStudents);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get('http://localhost:5000/api/classes/', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Placeholder for document upload API call
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      // Mocking a successful upload for demonstration
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(`http://example.com/documents/${Date.now()}-${file.name}`);
        }, 1000);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload document.');
      return null;
    }
  };

  const handleAddStudent = async (studentData) => {
    const token = JSON.parse(localStorage.getItem('authToken'));
    if (!token) {
      alert('no token is found in local storage');
      return;
    }
    try {
      const payload = {
        user_id: studentData.studentId,
        password: studentData.password,
        role: "student",
        full_name: studentData.name,
        email: studentData.email,
        admission_number: studentData.rollNumber,
        address: studentData.address,
        parent_id: studentData.parent, // must be an existing Parent _id
        class_id: studentData.class,     // must be an existing Class _id
        gender: studentData.gender,
        date_of_birth: studentData.dateOfBirth,
        student_type: studentData.studentType,
        documents: studentData.documents,
      };

      if (studentData.studentType === 'Migrated Student') {
        payload.previous_school_name = studentData.previousSchoolName;
        payload.previous_school_address = studentData.previousSchoolAddress;
        payload.previous_school_phone_number = studentData.previousSchoolPhoneNumber;
        payload.previous_school_start_date = studentData.previousSchoolStartDate;
        payload.previous_school_end_date = studentData.previousSchoolEndDate;
      }

      await axios.post('http://localhost:5000/api/students/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setOpenAddModal(false);
      // Re-fetch students to update the list
      // This is less efficient than directly updating state, but ensures data consistency with backend
      const response = await axios.get('http://localhost:5000/api/students/', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const formattedStudents = response.data.map(student => ({
        id: student._id,
        studentId: student.user_id,
        name: student.full_name,
        rollNumber: student.admission_number,
        email: student.email,
        class: student.class_id,
        contact: student.contact || '',
        parent: student.parent_id?.[0] || '',
        status: 'active',
        address: student.address,
        avatar: student.profile_image?.url || '',
        gender: student.gender || '',
        dateOfBirth: student.date_of_birth ? new Date(student.date_of_birth).toISOString().split('T')[0] : '',
        studentType: student.student_type || 'Current Student',
        previousSchoolName: student.previous_school_name || '',
        previousSchoolAddress: student.previous_school_address || '',
        previousSchoolPhoneNumber: student.previous_school_phone_number || '',
        previousSchoolStartDate: student.previous_school_start_date ? new Date(student.previous_school_start_date).toISOString().split('T')[0] : '',
        previousSchoolEndDate: student.previous_school_end_date ? new Date(student.previous_school_end_date).toISOString().split('T')[0] : '',
        documents: student.documents || [],
      }));
      setStudents(formattedStudents);

    } catch (error) {
      console.error('Failed to add student:', error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again. :" + error.response?.data?.message);
        localStorage.removeItem("authToken");
      } else {
        alert(error.response?.data?.message || 'Failed to add student');
      }
    }
  };

  const handleUpdateStudent = async (updatedStudentData) => {
    const token = JSON.parse(localStorage.getItem('authToken'));
    if (!token) {
      alert('no token is found in local storage');
      return;
    }
    try {
      const updatePayload = {
        user_id: updatedStudentData.studentId,
        full_name: updatedStudentData.name,
        admission_number: updatedStudentData.rollNumber,
        email: updatedStudentData.email,
        class_id: updatedStudentData.class,
        address: updatedStudentData.address,
        parent_id: [updatedStudentData.parent],
        status: updatedStudentData.status,
        gender: updatedStudentData.gender,
        date_of_birth: updatedStudentData.dateOfBirth,
        student_type: updatedStudentData.studentType,
        documents: updatedStudentData.documents,
      };

      if (updatedStudentData.newPassword) {
        updatePayload.password = updatedStudentData.newPassword;
      }
      if (updatedStudentData.studentType === 'Migrated Student') {
        updatePayload.previous_school_name = updatedStudentData.previousSchoolName;
        updatePayload.previous_school_address = updatedStudentData.previousSchoolAddress;
        updatePayload.previous_school_phone_number = updatedStudentData.previousSchoolPhoneNumber;
        updatePayload.previous_school_start_date = updatedStudentData.previousSchoolStartDate;
        updatePayload.previous_school_end_date = updatedStudentData.previousSchoolEndDate;
      } else {
        // Clear previous school details if student type changes from Migrated to Current
        updatePayload.previous_school_name = '';
        updatePayload.previous_school_address = '';
        updatePayload.previous_school_phone_number = '';
        updatePayload.previous_school_start_date = '';
        updatePayload.previous_school_end_date = '';
        updatePayload.documents = [];
      }

      const response = await axios.put(
        `http://localhost:5000/api/students/${updatedStudentData.id}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setStudents(prev => prev.map(s => s.id === updatedStudentData.id ? {
        ...s,
        id: response.data._id,
        studentId: response.data.user_id,
        name: response.data.full_name,
        rollNumber: response.data.admission_number,
        email: response.data.email,
        class: response.data.class_id,
        address: response.data.address,
        parent: response.data.parent_id?.[0] || '',
        status: response.data.status,
        gender: response.data.gender || '',
        dateOfBirth: response.data.date_of_birth ? new Date(response.data.date_of_birth).toISOString().split('T')[0] : '',
        studentType: response.data.student_type || 'Current Student',
        previousSchoolName: response.data.previous_school_name || '',
        previousSchoolAddress: response.data.previous_school_address || '',
        previousSchoolPhoneNumber: response.data.previous_school_phone_number || '',
        previousSchoolStartDate: response.data.previous_school_start_date ? new Date(response.data.previous_school_start_date).toISOString().split('T')[0] : '',
        previousSchoolEndDate: response.data.previous_school_end_date ? new Date(response.data.previous_school_end_date).toISOString().split('T')[0] : '',
        documents: response.data.documents || [],
      } : s));
      setOpenViewModal(false);
      setEditMode(false);
      alert('Student updated successfully!');

    } catch (error) {
      console.error('Failed to update student:', error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("authToken");
      } else {
        alert(error.response?.data?.message || 'Failed to update student');
      }
    }
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8 bg-[#F1F0FF]/50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {/* Card 1: Total Students */}
        <div className="relative h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <div className="p-6">
            <div className="absolute top-4 right-4">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm">
                <Users size={28} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">All Students</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Total Students</h3>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Active Students */}
        <div className="relative h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <div className="p-6">
            <div className="absolute top-4 right-4">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shadow-sm">
                <CheckCircle size={28} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">Currently Active</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Active</h3>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-3xl font-bold text-gray-900">{totalActive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Inactive Students */}
        <div className="relative h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <div className="p-6">
            <div className="absolute top-4 right-4">
              <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center shadow-sm">
                <PauseCircle size={28} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">On Hold</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Inactive</h3>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-3xl font-bold text-gray-900">{totalInactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Graduated Students */}
        <div className="relative h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <div className="p-6">
            <div className="absolute top-4 right-4">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
                <Award size={28} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">Completed</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Graduated</h3>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-3xl font-bold text-gray-900">{totalGraduated}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search and Buttons */}
      <div className='flex justify-between items-center mb-4'>
        {/* Search Bar - Desktop */}
        <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full md:w-[400px]'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input type="text" placeholder="Search by ID, Name, Email, Phone, Address..." className="p-2 bg-transparent outline-none flex-1 min-w-0" value={filters.searchQuery} onChange={(e) => handleFilterChange('searchQuery', e.target.value)} />
          {filters.searchQuery && (
            <button onClick={() => handleFilterChange('searchQuery', '')} className="text-gray-400 hover:text-gray-600 shrink-0" >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className='flex gap-2 ml-auto'> {/* ml-auto pushes buttons to the right */}
          {/* Mobile Search Button */}
          <button className='md:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md text-sm' onClick={() => setShowMobileSearch(!showMobileSearch)} >
            <Search size={16} /> Search
          </button>

          {/* Filters Button */}
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${showFilters || activeFilterCount > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100' }`} >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
            <span className="hidden md:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0 md:ml-1 inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button onClick={() => setOpenAddModal(true)} className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' >
            <Plus size={16} className='mr-2' />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className='md:hidden flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full mb-4 animate-fade-in'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input type="text" placeholder="Search by ID, Name, Email, Phone, Address..." className="p-2 bg-transparent outline-none flex-1 min-w-0" value={filters.searchQuery} onChange={(e) => handleFilterChange('searchQuery', e.target.value)} />
          {filters.searchQuery && (
            <button onClick={() => handleFilterChange('searchQuery', '')} className="text-gray-400 hover:text-gray-600 shrink-0" >
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
              <input type="text" placeholder="Filter by Student ID" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={filters.studentId} onChange={(e) => handleFilterChange('studentId', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <Select options={classOptions} value={classOptions.find(option => option.value === filters.class)} onChange={(selected) => handleFilterChange('class', selected ? selected.value : 'all')} placeholder="Select Class..." isClearable className="basic-select" classNamePrefix="select" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select options={statusOptions} value={statusOptions.find(option => option.value === filters.status)} onChange={(selected) => handleFilterChange('status', selected ? selected.value : 'all')} placeholder="Select Status..." isClearable className="basic-select" classNamePrefix="select" />
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <button onClick={clearFilters} className='text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors duration-200' >
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]"> Avatar </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"> Name </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"> Roll No. </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]"> Email </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]"> Class </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]"> Contact </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"> Status </th>
                <th scope="col" className="relative px-6 py-3 w-[17%]">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Avatar src={student.avatar} alt={student.name} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'active' ? 'bg-green-100 text-green-800' :
                        student.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton
                          onClick={() => {
                            setViewStudent(student);
                            setEditMode(false); // View mode
                            setOpenViewModal(true);
                          }}
                          aria-label="view"
                          size="small"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Users size={18} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setViewStudent(student);
                            setEditMode(true); // Edit mode
                            setOpenViewModal(true);
                          }}
                          aria-label="edit"
                          size="small"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(student.id)}
                          aria-label="delete"
                          size="small"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={18} />
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

      {/* Modals */}
      {openAddModal && (
        <AddStudent
          onClose={() => setOpenAddModal(false)}
          onSave={handleAddStudent}
          existingStudents={students}
          uploadFile={uploadFile}
        />
      )}

      {openViewModal && (
        <StudentDetails
          onClose={() => setOpenViewModal(false)}
          data={viewStudent}
          editable={editMode}
          onUpdate={handleUpdateStudent}
          existingStudents={students}
          uploadFile={uploadFile}
        />
      )}
    </div>
  );
};

export default StudentModule;