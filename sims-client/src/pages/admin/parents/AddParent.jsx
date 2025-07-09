import React, { useState } from 'react';
import axios from 'axios';
// import Select from 'react-select'; 


function AddParent({ onClose, onSave, existingParents }) {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    full_name: '',
    email: '',
    childrenCount: 1, // New field, default to 1
    phone: '',
    address: '',
    // image: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const { user_id, full_name, email, phone, password, childrenCount } = formData; // Removed subject, classes
    const trimmedParentId = user_id.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (!trimmedParentId) newErrors.user_id = 'Parent ID is required';
    if (!trimmedPassword) newErrors.password = 'Password is required';
    if (!full_name.trim()) newErrors.full_name = 'Name is required';

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

    // Check for duplicate Parent IDs, emails, and phone numbers among existing parents
    if (existingParents.some(p => p.user_id.toLowerCase() === trimmedParentId.toLowerCase())) {
      newErrors.user_id = 'Duplicate Parent ID found';
    }

    // if (existingParents.some(p => p.email.toLowerCase() === trimmedEmail)) {
    //   newErrors.email = 'Duplicate Gmail ID found';
    // }

    // if (existingParents.some(p => p.phone === trimmedPhone)) {
    //   newErrors.phone = 'Duplicate phone number found';
    // }

    // Validate Children Count
    if (childrenCount < 1 || childrenCount > 3) {
      newErrors.childrenCount = 'Children count must be between 1 and 3';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleNumberChange = (e) => { // New handler for childrenCount
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setFormData((prev) => ({ ...prev, [name]: isNaN(numValue) ? '' : numValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Removed handleSubjectChange and handleClassChange as they are no longer needed.

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const token = JSON.parse(localStorage.getItem('authToken'));
    if (!token) {
      console.error('No token found');
      return;
    }

    const formattedData = {
      user_id: formData.user_id.trim(),
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      childrenCount: formData.childrenCount,
      phone: formData.phone.trim(),
      address: formData.address?.trim() || '',
    };

    console.log('Submitting:', formattedData); // Add this for debugging

    const response = await axios.post(
      'http://localhost:5000/api/parents/',
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    onSave(formattedData);
    onClose();
  } catch (err) {
    console.error('Error details:', {
      message: err.message,
      response: err.response?.data,
      config: err.config
    });
  }
};

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Add New Parent</h2>
        <div className="flex flex-col gap-3">

          {/* Parent ID */}
          <div>
            <input
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="Parent ID *"
              className={`p-2 border rounded w-full ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
          </div>

          {/* Password with toggle */}
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

          {/* Other Inputs */}
          {['full_name', 'email', 'phone', 'address'].map((field) => (
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

          {/* Children Count Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Children Count (1-3) *</label>
            <input
              type="number"
              name="childrenCount"
              value={formData.childrenCount}
              onChange={handleNumberChange}
              min="1"
              max="3"
              placeholder="Enter number of children (1-3)"
              className={`p-2 border rounded w-full ${errors.childrenCount ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.childrenCount && <p className="text-red-500 text-sm mt-1">{errors.childrenCount}</p>}
          </div>

          {/* Removed Subject Select */}
          {/* Removed Classes Select */}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <div
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                  setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded cursor-pointer bg-gray-50 hover:bg-gray-100 text-center"
              onClick={() => document.getElementById('fileInput').click()}
            >
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <p className="text-gray-600 text-sm">Drag & drop or click to upload</p>
              )}
            </div>
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
}

export default AddParent;