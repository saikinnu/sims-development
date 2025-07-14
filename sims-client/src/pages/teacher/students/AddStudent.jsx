import React, { useState } from 'react';
import Select from 'react-select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Plus, X, Calendar, Venus, Briefcase, School, Paperclip, FileText, Image } from 'lucide-react'; // Added Image icon

const CLASS_OPTIONS = [];
for (let i = 1; i <= 10; i++) {
  ['A', 'B', 'C'].forEach((section) => {
    CLASS_OPTIONS.push({ label: `${i}-${section}`, value: `${i}-${section}` });
  });
}


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

const AddStudent = ({ onClose, onSave, existingStudents, uploadFile }) => {
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
    avatar: '', // This will store the URL after upload
    address: '',
    gender: '',
    dateOfBirth: '',
    studentType: 'Current Student',
    previousSchoolName: '',
    previousSchoolAddress: '',
    previousSchoolPhoneNumber: '',
    previousSchoolStartDate: '',
    previousSchoolEndDate: '',
    documents: [],
  });
  const [errors, setErrors] = useState({});
  const [newStudentDocumentsToUpload, setNewStudentDocumentsToUpload] = useState([]);
  const [newStudentAvatarToUpload, setNewStudentAvatarToUpload] = useState(null); // To hold the file object for avatar
  const [avatarPreview, setAvatarPreview] = useState(''); // To hold the URL for image preview
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = async () => {
    const newErrors = {};
    const { studentId, password, name, rollNumber, email, class: studentClass, contact, parent, address, gender, dateOfBirth, studentType, previousSchoolName, previousSchoolAddress, previousSchoolPhoneNumber, previousSchoolStartDate, previousSchoolEndDate } = newStudent;

    if (!studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (password.trim().length < 6) newErrors.password = 'Password must be at least 6 characters long';
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

    if (studentType === 'Migrated Student') {
      if (!previousSchoolName.trim()) newErrors.previousSchoolName = 'Previous School Name is required for Migrated Students';
      if (!previousSchoolAddress.trim()) newErrors.previousSchoolAddress = 'Previous School Address is required for Migrated Students';
      if (!previousSchoolPhoneNumber.trim()) newErrors.previousSchoolPhoneNumber = 'Previous School Phone Number is required for Migrated Students';
      else if (!/^\d{10}$/.test(previousSchoolPhoneNumber)) newErrors.previousSchoolPhoneNumber = 'Previous School Phone Number must be 10 digits';
      if (!previousSchoolStartDate) newErrors.previousSchoolStartDate = 'Previous School Start Date is required for Migrated Students';
      if (!previousSchoolEndDate) newErrors.previousSchoolEndDate = 'Previous School End Date is required for Migrated Students';
    }

    // Check for duplicates
    if (existingStudents) {
      if (existingStudents.some(s => s.studentId.toLowerCase() === studentId.toLowerCase())) {
        newErrors.studentId = 'Student ID already exists';
      }
      if (existingStudents.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        newErrors.email = 'Email already exists';
      }
      if (existingStudents.some(s => s.contact.toLowerCase() === contact.toLowerCase())) {
        newErrors.contact = 'Contact number already exists';
      }
      if (existingStudents.some(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase())) {
        newErrors.rollNumber = 'Roll Number already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setNewStudent(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewStudentDocumentsToUpload(prev => [...prev, ...files]);
  };

  const handleRemoveDocument = (indexToRemove) => {
    setNewStudentDocumentsToUpload(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewStudentAvatarToUpload(file);
      setAvatarPreview(URL.createObjectURL(file)); // Create a URL for preview
    } else {
      setNewStudentAvatarToUpload(null);
      setAvatarPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      // Upload avatar if any
      let avatarUrl = newStudent.avatar;
      if (newStudentAvatarToUpload) {
        const url = await uploadFile(newStudentAvatarToUpload);
        if (url) {
          avatarUrl = url;
        }
      }

      // Upload other documents if any
      const uploadedDocumentUrls = [];
      for (const file of newStudentDocumentsToUpload) {
        const url = await uploadFile(file);
        if (url) {
          uploadedDocumentUrls.push({ name: file.name, url: url });
        }
      }

      onSave({ ...newStudent, avatar: avatarUrl, documents: uploadedDocumentUrls });
      onClose();
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Student</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID <span className="text-red-500">*</span></label>
            <input type="text" name="studentId" value={newStudent.studentId} onChange={handleChange}
              className={`mt-1 block w-full border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={newStudent.password} onChange={handleChange}
                className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 pr-10`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={newStudent.name} onChange={handleChange}
              className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number <span className="text-red-500">*</span></label>
            <input type="text" name="rollNumber" value={newStudent.rollNumber} onChange={handleChange}
              className={`mt-1 block w-full border ${errors.rollNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
            {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={newStudent.email} onChange={handleChange}
              className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class <span className="text-red-500">*</span></label>
            <Select options={CLASS_OPTIONS} value={CLASS_OPTIONS.find(option => option.value === newStudent.class)}
              onChange={(selected) => handleSelectChange('class', selected)} placeholder="Select Class"
              className={`mt-1 basic-single ${errors.class ? 'border-red-500' : ''}`}
              classNamePrefix="select" />
            {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact <span className="text-red-500">*</span></label>
            <input type="text" name="contact" value={newStudent.contact} onChange={handleChange}
              className={`mt-1 block w-full border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Name/ID <span className="text-red-500">*</span></label>
            <input type="text" name="parent" value={newStudent.parent} onChange={handleChange}
              className={`mt-1 block w-full border ${errors.parent ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
            {errors.parent && <p className="text-red-500 text-xs mt-1">{errors.parent}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
            <textarea name="address" value={newStudent.address} onChange={handleChange} rows="2"
              className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}></textarea>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
            <Select options={GENDER_OPTIONS} value={GENDER_OPTIONS.find(option => option.value === newStudent.gender)}
              onChange={(selected) => handleSelectChange('gender', selected)} placeholder="Select Gender"
              className={`mt-1 basic-single ${errors.gender ? 'border-red-500' : ''}`}
              classNamePrefix="select" />
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
            <input type="date" name="dateOfBirth" value={newStudent.dateOfBirth} onChange={handleChange}
              className={`mt-1 block w-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Type <span className="text-red-500">*</span></label>
            <Select options={STUDENT_TYPE_OPTIONS} value={STUDENT_TYPE_OPTIONS.find(option => option.value === newStudent.studentType)}
              onChange={(selected) => handleSelectChange('studentType', selected)} placeholder="Select Type"
              className={`mt-1 basic-single ${errors.studentType ? 'border-red-500' : ''}`}
              classNamePrefix="select" />
            {errors.studentType && <p className="text-red-500 text-xs mt-1">{errors.studentType}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Student Avatar</label>
            <div
              className="flex items-center justify-center p-4 border-2 border-dashed rounded cursor-pointer text-center border-gray-400 bg-gray-50 hover:bg-gray-100"
              onClick={() => document.getElementById('avatarUpload').click()}
            >
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <Image size={16} /> Drag & drop or click to upload avatar
              </p>
            </div>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            {avatarPreview && (
              <div className="mt-2 flex justify-center">
                <img src={avatarPreview} alt="Avatar Preview" className="h-24 w-24 object-cover rounded-full border border-gray-300" />
              </div>
            )}
            {newStudentAvatarToUpload && (
              <p className="text-sm text-gray-700 mt-1">Selected: {newStudentAvatarToUpload.name}</p>
            )}
          </div>

          {newStudent.studentType === 'Migrated Student' && (
            <>
              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Previous School Details</h4>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">School Name <span className="text-red-500">*</span></label>
                <input type="text" name="previousSchoolName" value={newStudent.previousSchoolName} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.previousSchoolName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.previousSchoolName && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                <input type="text" name="previousSchoolAddress" value={newStudent.previousSchoolAddress} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.previousSchoolAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.previousSchoolAddress && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <input type="text" name="previousSchoolPhoneNumber" value={newStudent.previousSchoolPhoneNumber} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.previousSchoolPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.previousSchoolPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolPhoneNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                <input type="date" name="previousSchoolStartDate" value={newStudent.previousSchoolStartDate} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.previousSchoolStartDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.previousSchoolStartDate && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolStartDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
                <input type="date" name="previousSchoolEndDate" value={newStudent.previousSchoolEndDate} onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.previousSchoolEndDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`} />
                {errors.previousSchoolEndDate && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolEndDate}</p>}
              </div>

              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Documents</h4>
                <div
                  className="flex items-center justify-center p-4 border-2 border-dashed rounded cursor-pointer text-center border-gray-400 bg-gray-50 hover:bg-gray-100"
                  onClick={() => document.getElementById('documentUpload').click()}
                >
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <Paperclip size={16} /> Drag & drop or click to upload documents
                  </p>
                </div>
                <input
                  id="documentUpload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
                {newStudentDocumentsToUpload.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-700">
                    {newStudentDocumentsToUpload.map((file, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                        <span className="flex items-center gap-1"><FileText size={14} /> {file.name}</span>
                        <button type="button" onClick={() => handleRemoveDocument(index)} className="text-red-500 hover:text-red-700">
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Student
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudent;