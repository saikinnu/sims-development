// src/pages/parent/MyChildrenModule.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, GraduationCap, Grid, ChevronRight,
  BookOpen, Calendar, Hash, Award, Building, Mail, Phone, XCircle, ListOrdered // Import ListOrdered for roll number
} from 'lucide-react';


const MyChildrenModule = () => {
  const navigate = useNavigate();

  const [childrenData, setChildrenData] = useState([]);

  // NEW STATES FOR MODAL
  const [showModal, setShowModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    // Directly setting sample data as loading state is removed
    const sampleData = [
      {
        id: 'S001',
        name: 'Alex Johnson',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80',
        class: 'Grade 10',
        section: 'A',
        admissionNo: 'ADM001',
        rollNo: 'A1001', // Added Roll Number
        dateOfBirth: '2014-03-15',
        parentId: 'PNT001', // Changed from parentEmail to parentId
        parentPhone: '+919876543210',
        teacher: 'Mr. David Lee',
        address: '123, Pine Street, Bengaluru, Karnataka, 560001'
      },
      {
        id: 'S002',
        name: 'Emily Johnson',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80',
        class: 'Grade 8',
        section: 'B',
        admissionNo: 'ADM002',
        rollNo: 'B8002', // Added Roll Number
        dateOfBirth: '2016-09-01',
        parentId: 'PNT002', // Changed from parentEmail to parentId
        parentPhone: '+919876543210',
        teacher: 'Ms. Emily White',
        address: '456, Oak Avenue, Bengaluru, Karnataka, 560002'
      },
    ];
    setChildrenData(sampleData);
  }, []);


  // MODIFIED handleViewDetails to open modal
  const handleViewDetails = (child) => {
    setSelectedChild(child); // Set the child data to be displayed in the modal
    setShowModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChild(null); // Clear selected child data when closing
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <User size={32} className="text-blue-600" />
            My Children
          </h1>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {childrenData.map((child) => (
            <div key={child.id} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={child.profileImage || '/default-child-avatar.png'}
                    alt={`${child.name}'s profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg"
                  />
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">{child.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Hash size={16} className="text-gray-400" /> Admission No: {child.admissionNo}
                  </p>
                </div>

                <div className="space-y-4 text-gray-700 mb-8">
                  <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <GraduationCap size={20} className="text-blue-600" />
                    <span className="font-semibold text-gray-800">Class:</span> {child.class} ({child.section || 'N/A'})
                  </div>
                  <div className="flex items-center gap-3 bg-green-50/50 p-3 rounded-lg border border-green-100">
                    <BookOpen size={20} className="text-green-600" />
                    <span className="font-semibold text-gray-800">Teacher:</span> {child.teacher || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                    <Calendar size={20} className="text-purple-600" />
                    <span className="font-semibold text-gray-800">DOB:</span> {child.dateOfBirth || 'N/A'}
                  </div>
                  {/* NEW: Roll Number on card */}
                  <div className="flex items-center gap-3 bg-cyan-50/50 p-3 rounded-lg border border-cyan-100">
                    <ListOrdered size={20} className="text-cyan-600" />
                    <span className="font-semibold text-gray-800">Roll No:</span> {child.rollNo || 'N/A'}
                  </div>
                  {/* Removed Address and Achievements from card to show only in modal */}
                </div>

                <button
                  onClick={() => handleViewDetails(child)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                  aria-label={`View details for ${child.name}`}
                >
                  View Details <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      {/* Child Details Modal */}
      {showModal && selectedChild && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close modal"
            >
              <XCircle size={24} /> {/* Adjusted icon size */}
            </button>

            <div className="flex flex-col items-center mb-6 pb-4 border-b border-gray-200">
              <img
                src={selectedChild.profileImage || '/default-child-avatar.png'}
                alt={`${selectedChild.name}'s profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-lg" /* Slightly smaller image */
              />
              <h2 className="text-2xl font-extrabold text-gray-900 mt-4">{selectedChild.name}</h2> {/* Adjusted text size */}
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <Hash size={16} className="text-gray-500" /> Admission No: {selectedChild.admissionNo} {/* Adjusted text size */}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700"> {/* Added gap-x and gap-y */}
              <div className="flex items-center gap-2"> {/* Reduced gap */}
                <GraduationCap size={18} className="text-blue-600" /> {/* Adjusted icon size */}
                <span className="font-semibold text-sm">Class:</span> <span className="text-sm">{selectedChild.class} ({selectedChild.section || 'N/A'})</span> {/* Adjusted text size */}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-green-600" />
                <span className="font-semibold text-sm">Teacher:</span> <span className="text-sm">{selectedChild.teacher || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-purple-600" />
                <span className="font-semibold text-sm">Date of Birth:</span> <span className="text-sm">{selectedChild.dateOfBirth || 'N/A'}</span>
              </div>
              {/* Roll Number in Modal */}
              <div className="flex items-center gap-2">
                <ListOrdered size={18} className="text-cyan-600" />
                <span className="font-semibold text-sm">Roll No:</span> <span className="text-sm">{selectedChild.rollNo || 'N/A'}</span>
              </div>
              <div className="flex items-start gap-2 col-span-1 md:col-span-2"> {/* Aligned to start for multiline address */}
                <Building size={18} className="text-red-600 mt-1" />
                <span className="font-semibold text-sm">Address:</span> <span className="text-sm">{selectedChild.address || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                <Mail size={18} className="text-teal-600" />
                <span className="font-semibold text-sm">Parent ID:</span> <span className="text-sm">{selectedChild.parentId || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                <Phone size={18} className="text-orange-600" />
                <span className="font-semibold text-sm">Parent Phone:</span> <span className="text-sm">{selectedChild.parentPhone || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 text-right">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
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

export default MyChildrenModule;