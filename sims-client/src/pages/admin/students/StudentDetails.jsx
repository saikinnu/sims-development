// StudentDetails.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Edit, X, Calendar, Venus, Briefcase, School, Paperclip, FileText, Download, User, IdCard, Mail, Phone, Hash, BookOpen, Home, Key, Users } from 'lucide-react'; // Added necessary icons

const CLASS_OPTIONS = [
  { value: '9th', label: '9th' },
  { value: '10th', label: '10th' },
  { value: '11th', label: '11th' },
  { value: '12th', label: '12th' },
];

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const STUDENT_TYPE_OPTIONS = [
  { value: 'Current Student', label: 'Current Student' },
  { value: 'Migrated Student', label: 'Migrated Student' },
];

const StudentDetails = ({ data, editable = false, onClose, onUpdate, existingStudents, uploadFile }) => {
  const [viewStudent, setViewStudent] = useState(data);
  const [errors, setErrors] = useState({});
  const [viewStudentDocumentsToUpload, setViewStudentDocumentsToUpload] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      setViewStudent({
        ...data,
        class: data.class ? CLASS_OPTIONS.find(c => c.value === data.class) : null,
        gender: data.gender ? GENDER_OPTIONS.find(g => g.value === data.gender) : null,
        studentType: data.studentType ? STUDENT_TYPE_OPTIONS.find(st => st.value === data.studentType) : null,
        // Ensure date fields are in YYYY-MM-DD format for input type="date"
        dateOfBirth: data.dateOfBirth || '',
        previousSchoolStartDate: data.previousSchoolStartDate || '',
        previousSchoolEndDate: data.previousSchoolEndDate || '',
        newPassword: '', // For password update in edit mode
      });
    }
  }, [data]);

  const validateForm = async () => {
    const newErrors = {};
    const { studentId, name, rollNumber, email, class: studentClass, contact, parent, address, gender, dateOfBirth, studentType, previousSchoolName, previousSchoolAddress, previousSchoolPhoneNumber, previousSchoolStartDate, previousSchoolEndDate, newPassword } = viewStudent;

    if (!studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!rollNumber.trim()) newErrors.rollNumber = 'Roll Number is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!studentClass) newErrors.class = 'Class is required';
    if (!contact.trim()) newErrors.contact = 'Contact is required';
    else if (!/^\d{10}$/.test(contact)) newErrors.contact = 'Contact must be 10 digits';
    if (!parent.trim()) newErrors.parent = 'Parent Name/ID is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (editable && newPassword.trim() && newPassword.trim().length < 6) newErrors.newPassword = 'New password must be at least 6 characters long';


    if (studentType?.value === 'Migrated Student') {
      if (!previousSchoolName.trim()) newErrors.previousSchoolName = 'Previous School Name is required for Migrated Students';
      if (!previousSchoolAddress.trim()) newErrors.previousSchoolAddress = 'Previous School Address is required for Migrated Students';
      if (!previousSchoolPhoneNumber.trim()) newErrors.previousSchoolPhoneNumber = 'Previous School Phone Number is required for Migrated Students';
      else if (!/^\d{10}$/.test(previousSchoolPhoneNumber)) newErrors.previousSchoolPhoneNumber = 'Previous School Phone Number must be 10 digits';
      if (!previousSchoolStartDate) newErrors.previousSchoolStartDate = 'Previous School Start Date is required for Migrated Students';
      if (!previousSchoolEndDate) newErrors.previousSchoolEndDate = 'Previous School End Date is required for Migrated Students';
    }

    // Check for duplicates, excluding the current student being edited
    if (existingStudents) {
      const filteredExisting = existingStudents.filter(s => s.id !== data.id);
      if (filteredExisting.some(s => s.studentId.toLowerCase() === studentId.toLowerCase())) {
        newErrors.studentId = 'Student ID already exists';
      }
      if (filteredExisting.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        newErrors.email = 'Email already exists';
      }
      if (filteredExisting.some(s => s.contact.toLowerCase() === contact.toLowerCase())) {
        newErrors.contact = 'Contact number already exists';
      }
      if (filteredExisting.some(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase())) {
        newErrors.rollNumber = 'Roll Number already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setViewStudent(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setViewStudent(prev => ({ ...prev, [name]: selectedOption }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    setViewStudentDocumentsToUpload(prev => [...prev, ...files]);
  };

  const handleRemoveExistingDocument = (indexToRemove) => {
    setViewStudent(prev => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleRemoveNewUploadDocument = (indexToRemove) => {
    setViewStudentDocumentsToUpload(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const newlyUploadedDocumentUrls = [];
      for (const file of viewStudentDocumentsToUpload) {
        const url = await uploadFile(file);
        if (url) {
          newlyUploadedDocumentUrls.push({ name: file.name, url: url });
        }
      }

      onUpdate({
        ...viewStudent,
        class: viewStudent.class?.value || '',
        gender: viewStudent.gender?.value || '',
        studentType: viewStudent.studentType?.value || 'Current Student',
        documents: [...(viewStudent.documents || []), ...newlyUploadedDocumentUrls],
      });
      onClose();
    }
  };

  if (!viewStudent) return null;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editable ? 'Edit Student Details' : 'View Student Details'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          {editable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Editable Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Student ID <span className="text-red-500">*</span></label>
                <input type="text" name="studentId" value={viewStudent.studentId} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="newPassword" value={viewStudent.newPassword} onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 pr-10`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={viewStudent.name} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Roll Number <span className="text-red-500">*</span></label>
                <input type="text" name="rollNumber" value={viewStudent.rollNumber} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.rollNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={viewStudent.email} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class <span className="text-red-500">*</span></label>
                <Select options={CLASS_OPTIONS} value={viewStudent.class}
                  onChange={(selected) => handleSelectChange('class', selected)} placeholder="Select Class"
                  className={`mt-1 basic-single ${errors.class ? 'border-red-500' : ''}`}
                  classNamePrefix="select" />
                {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact <span className="text-red-500">*</span></label>
                <input type="text" name="contact" value={viewStudent.contact} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parent Name/ID <span className="text-red-500">*</span></label>
                <input type="text" name="parent" value={viewStudent.parent} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.parent ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.parent && <p className="text-red-500 text-xs mt-1">{errors.parent}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                <textarea name="address" value={viewStudent.address} onChange={handleChange} rows="2"
                  className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}></textarea>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                <Select options={GENDER_OPTIONS} value={viewStudent.gender}
                  onChange={(selected) => handleSelectChange('gender', selected)} placeholder="Select Gender"
                  className={`mt-1 basic-single ${errors.gender ? 'border-red-500' : ''}`}
                  classNamePrefix="select" />
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" name="dateOfBirth" value={viewStudent.dateOfBirth} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Type <span className="text-red-500">*</span></label>
                <Select options={STUDENT_TYPE_OPTIONS} value={viewStudent.studentType}
                  onChange={(selected) => handleSelectChange('studentType', selected)} placeholder="Select Type"
                  className={`mt-1 basic-single ${errors.studentType ? 'border-red-500' : ''}`}
                  classNamePrefix="select" />
                {errors.studentType && <p className="text-red-500 text-xs mt-1">{errors.studentType}</p>}
              </div>

              {viewStudent.studentType?.value === 'Migrated Student' && (
                <>
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Previous School Details</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">School Name <span className="text-red-500">*</span></label>
                    <input type="text" name="previousSchoolName" value={viewStudent.previousSchoolName} onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.previousSchoolName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                    {errors.previousSchoolName && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                    <input type="text" name="previousSchoolAddress" value={viewStudent.previousSchoolAddress} onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.previousSchoolAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                    {errors.previousSchoolAddress && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolAddress}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                    <input type="text" name="previousSchoolPhoneNumber" value={viewStudent.previousSchoolPhoneNumber} onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.previousSchoolPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                    {errors.previousSchoolPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolPhoneNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                    <input type="date" name="previousSchoolStartDate" value={viewStudent.previousSchoolStartDate} onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.previousSchoolStartDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                    {errors.previousSchoolStartDate && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolStartDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
                    <input type="date" name="previousSchoolEndDate" value={viewStudent.previousSchoolEndDate} onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.previousSchoolEndDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                    {errors.previousSchoolEndDate && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolEndDate}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Documents</h4>
                    <ul className="mt-2 text-sm text-gray-700">
                      {(viewStudent.documents || []).map((doc, index) => (
                        <li key={`existing-${index}`} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                            <FileText size={14} /> {doc.name}
                          </a>
                          <button type="button" onClick={() => handleRemoveExistingDocument(index)} className="text-red-500 hover:text-red-700">
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                      {viewStudentDocumentsToUpload.map((file, index) => (
                        <li key={`new-${index}`} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                          <span className="flex items-center gap-1"><FileText size={14} /> {file.name} (New)</span>
                          <button type="button" onClick={() => handleRemoveNewUploadDocument(index)} className="text-red-500 hover:text-red-700">
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => document.getElementById('editStudentDocumentUpload').click()}
                      className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus size={16} /> Add More Documents
                    </button>
                    <input
                      id="editStudentDocumentUpload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              {/* Display Fields (Read-Only) */}
              <div className="flex items-center gap-2"><IdCard size={16} className="text-blue-400" /><span className="font-medium">Student ID:</span> <span className="text-gray-800">{viewStudent.studentId}</span></div>
              <div className="flex items-center gap-2"><User size={16} className="text-blue-400" /><span className="font-medium">Name:</span> <span className="text-gray-800">{viewStudent.name}</span></div>
              <div className="flex items-center gap-2"><Hash size={16} className="text-blue-400" /><span className="font-medium">Roll No.:</span> <span className="text-gray-800">{viewStudent.rollNumber}</span></div>
              <div className="flex items-center gap-2"><Mail size={16} className="text-blue-400" /><span className="font-medium">Email:</span> <span className="text-gray-800">{viewStudent.email}</span></div>
              <div className="flex items-center gap-2"><BookOpen size={16} className="text-blue-400" /><span className="font-medium">Class:</span> <span className="text-gray-800">{viewStudent.class?.label || viewStudent.class || '-'}</span></div>
              <div className="flex items-center gap-2"><Phone size={16} className="text-blue-400" /><span className="font-medium">Contact:</span> <span className="text-gray-800">{viewStudent.contact}</span></div>
              <div className="flex items-center gap-2"><Users size={16} className="text-blue-400" /><span className="font-medium">Parent:</span> <span className="text-gray-800">{viewStudent.parent}</span></div>
              <div className="flex items-center gap-2"><Home size={16} className="text-blue-400" /><span className="font-medium">Address:</span> <span className="text-gray-800">{viewStudent.address}</span></div>
              <div className="flex items-center gap-2"><Venus size={16} className="text-blue-400" /><span className="font-medium">Gender:</span> <span className="text-gray-800">{viewStudent.gender?.label || viewStudent.gender || '-'}</span></div>
              <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-400" /><span className="font-medium">Date of Birth:</span> <span className="text-gray-800">{viewStudent.dateOfBirth}</span></div>
              <div className="flex items-center gap-2"><Briefcase size={16} className="text-blue-400" /><span className="font-medium">Student Type:</span> <span className="text-gray-800">{viewStudent.studentType?.label || viewStudent.studentType || '-'}</span></div>
              {viewStudent.studentType?.value === 'Migrated Student' && (
                <>
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-lg font-semibold text-gray-800">Previous School Details</h4>
                  </div>
                  <div className="flex items-center gap-2"><School size={16} className="text-blue-400" /><span className="font-medium">School Name:</span> <span className="text-gray-800">{viewStudent.previousSchoolName || '-'}</span></div>
                  <div className="flex items-center gap-2"><Home size={16} className="text-blue-400" /><span className="font-medium">Address:</span> <span className="text-gray-800">{viewStudent.previousSchoolAddress || '-'}</span></div>
                  <div className="flex items-center gap-2"><Phone size={16} className="text-blue-400" /><span className="font-medium">Phone:</span> <span className="text-gray-800">{viewStudent.previousSchoolPhoneNumber || '-'}</span></div>
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-400" /><span className="font-medium">Start Date:</span> <span className="text-gray-800">{viewStudent.previousSchoolStartDate || '-'}</span></div>
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-400" /><span className="font-medium">End Date:</span> <span className="text-gray-800">{viewStudent.previousSchoolEndDate || '-'}</span></div>
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-lg font-semibold text-gray-800">Documents</h4>
                    <ul className="mt-2 text-sm text-gray-700">
                      {(viewStudent.documents || []).length > 0 ? (
                        (viewStudent.documents || []).map((doc, index) => (
                          <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                              <FileText size={14} /> {doc.name}
                            </a>
                            <Download size={16} className="text-gray-500" />
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500">No documents uploaded.</p>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          onClick={() => { onClose(); if (editable) setErrors({}); }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          {editable ? 'Cancel' : 'Close'}
        </button>
        {editable && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetails;