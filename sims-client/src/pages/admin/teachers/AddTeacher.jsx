import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios'; // Import axios

const SUBJECT_OPTIONS = [
  'Math', 'Science', 'English', 'History', 'Geography', 'Biology',
  'Chemistry', 'Physics', 'Computer Science', 'Art', 'Music', 'Drama',
].map((sub) => ({ label: sub, value: sub }));

const CLASS_OPTIONS = [];
for (let i = 1; i <= 10; i++) {
  ['A', 'B', 'C'].forEach((section) => {
    CLASS_OPTIONS.push({ label: `${i}-${section}`, value: `${i}-${section}` });
  });
}

function AddTeacher({ onClose, onSave, existingTeachers }) {
  const [formData, setFormData] = useState({
    empId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    subject: [],
    classes: [],
    classTeacher: null,
    address: '',
    image: null, // This would typically be a file object if an input type="file" is used
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const { empId, name, email, phone, password, subject, classes, classTeacher } = formData;
    const trimmedEmpId = empId.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmpId) newErrors.empId = 'EMP ID is required';
    if (!trimmedPassword) newErrors.password = 'Password is required';
    if (!name.trim()) newErrors.name = 'Name is required';

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!trimmedEmail) newErrors.email = 'Email is required';
    else if (!gmailRegex.test(trimmedEmail)) {
      newErrors.email = 'Only Gmail addresses are allowed';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!trimmedPhone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(trimmedPhone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!classTeacher) newErrors.classTeacher = 'Class Teacher is required';
    // if (!image) newErrors.image = 'Image is required'; // Uncomment if image is mandatory

    // Ensure existingTeachers is an array and filter out any null/undefined entries
    const validExistingTeachers = Array.isArray(existingTeachers) ? existingTeachers.filter(t => t) : [];

    // Safely check for duplicate EMP ID, Email, and Phone
    if (validExistingTeachers.some(t => (t.empId?.toLowerCase() || '') === trimmedEmpId.toLowerCase())) {
      newErrors.empId = 'Duplicate EMP ID found';
    }

    if (validExistingTeachers.some(t => (t.email?.toLowerCase() || '') === trimmedEmail)) {
      newErrors.email = 'Duplicate Gmail ID found';
    }

    if (validExistingTeachers.some(t => (t.phone || '') === trimmedPhone)) {
      newErrors.phone = 'Duplicate phone number found';
    }

    if (subject.length < 1) newErrors.subject = 'At least 1 subject is required';
    if (classes.length < 1) newErrors.classes = 'At least 1 class is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubjectChange = (selected) => {
    if (selected.length <= 5) {
      setFormData((prev) => ({ ...prev, subject: selected }));
      setErrors((prev) => ({ ...prev, subject: '' }));
    }
  };

  const handleClassChange = (selected) => {
    setFormData((prev) => ({ ...prev, classes: selected }));
    setErrors((prev) => ({ ...prev, classes: '' }));
  };

  const handleClassTeacherChange = (selected) => {
    setFormData((prev) => ({ ...prev, classTeacher: selected }));
    setErrors((prev) => ({ ...prev, classTeacher: '' }));
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type.startsWith('image/')) {
  //     setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  //     setErrors((prev) => ({ ...prev, image: '' }));
  //   }
  // };

  const handleSubmit = async () => {
    console.log('handleSubmit is working fine');
    if (!validateForm()) {
      console.error("Form validation failed. Check errors displayed on the form.");
      return; // Exit if validation fails
    }

    const trimmedEmpId = formData.empId.trim();
    if (!trimmedEmpId) {
      // This case should ideally be caught by validateForm, but as a safeguard:
      console.error("EMP ID is empty after trimming. Cannot submit with empty ID.");
      setErrors(prev => ({ ...prev, empId: 'EMP ID cannot be empty' })); // Display error to user
      return;
    }

    try {
      // Retrieve token from local storage
      const token = JSON.parse(localStorage.getItem('authToken'));
      if (!token) {
        console.error('No token found in local storage. Please log in.');
        // You might want to show a user-friendly message here
        return;
      }

      // Construct the data object to send as JSON
      const dataToSend = {
        user_id: trimmedEmpId, // Use the trimmed and validated EMP ID
        full_name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        phone: formData.phone.trim(),
        address: formData.address?.trim() || '',
        qualification: formData.qualification?.trim() || '', // Assuming qualification is optional
        // Explicitly JSON.stringify these arrays
        subjects_taught: JSON.stringify(formData.subject.map(s => s.value)),
        assigned_classes: JSON.stringify(formData.classes.map(c => c.value)),
        class_teacher: formData.classTeacher.value,
        // If image is handled as a URL, include it like this.
        // If it's a file, you'd need a separate multipart/form-data request or a different API endpoint.
        profile_image: formData.image ? { public_id: '', url: formData.image } : null,
        certificates: [], // Assuming certificates are optional or handled separately
      };

      console.log('Sending data:', dataToSend);
      console.log('User ID being sent:', dataToSend.user_id); // Log the user_id being sent

      // Make the POST request with the JSON data
      const response = await axios.post('http://localhost:5000/api/teachers/', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // This header will be automatically set by axios for JSON data
        },
      });

      console.log('Teacher added successfully:', response.data);
      onSave(response.data); // Update the local state in TeacherModule
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('Failed to add teacher:', error.response ? error.response.data : error.message);
      // You can set an error state here to display a message to the user
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
        <div className="flex flex-col gap-3">

          <div>
            <input
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              placeholder="Teacher EMP ID *"
              className={`p-2 border rounded w-full ${errors.empId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.empId && <p className="text-red-500 text-sm mt-1">{errors.empId}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password *"
              className={`p-2 pr-10 border rounded w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 text-lg"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {['name', 'email', 'phone', 'address'].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                className={`p-2 border rounded w-full ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Subjects (1–5) *</label>
            <Select
              isMulti
              options={SUBJECT_OPTIONS}
              value={formData.subject}
              onChange={handleSubjectChange}
              placeholder="Select subjects..."
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assigned Classes *</label>
            <Select
              isMulti
              options={CLASS_OPTIONS}
              value={formData.classes}
              onChange={handleClassChange}
              placeholder="Select classes..."
            />
            {errors.classes && <p className="text-red-500 text-sm mt-1">{errors.classes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class Teacher *</label>
            <Select
              options={CLASS_OPTIONS}
              value={formData.classTeacher}
              onChange={handleClassTeacherChange}
              placeholder="Select class teacher..."
            />
            {errors.classTeacher && <p className="text-red-500 text-sm mt-1">{errors.classTeacher}</p>}
          </div>

          {/* If you re-enable image upload, consider how your backend expects image data.
              For file uploads, you'd typically use FormData and remove the "Content-Type": "application/json" header,
              or use a separate endpoint for image uploads.
          <div>
            <label className="block text-sm font-medium mb-1">Upload Image *</label>
            <div
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                  setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
                  setErrors((prev) => ({ ...prev, image: '' }));
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center justify-center p-4 border-2 border-dashed rounded cursor-pointer text-center ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-400 bg-gray-50 hover:bg-gray-100'
                }`}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <p className="text-gray-600 text-sm">Drag & drop or click to upload</p>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          */}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
}

export default AddTeacher;
