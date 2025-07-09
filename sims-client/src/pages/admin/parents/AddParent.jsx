// C:\Users\user\Desktop\SIMS\src\pages\admin\parents\AddParent.jsx
import React, { useState } from 'react';
// Select is no longer needed here, can be removed if not used elsewhere
// import Select from 'react-select'; 

// Removed SUBJECT_OPTIONS and CLASS_OPTIONS as they are no longer needed.

function AddParent({ onClose, onSave, existingParents }) {
  const [formData, setFormData] = useState({
    parentId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    childrenCount: 1, // New field, default to 1
    address: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const { parentId, name, email, phone, password, childrenCount } = formData; // Removed subject, classes
    const trimmedParentId = parentId.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (!trimmedParentId) newErrors.parentId = 'Parent ID is required';
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

    // Check for duplicate Parent IDs, emails, and phone numbers among existing parents
    if (existingParents.some(p => p.parentId.toLowerCase() === trimmedParentId.toLowerCase())) {
      newErrors.parentId = 'Duplicate Parent ID found';
    }

    if (existingParents.some(p => p.email.toLowerCase() === trimmedEmail)) {
      newErrors.email = 'Duplicate Gmail ID found';
    }

    if (existingParents.some(p => p.phone === trimmedPhone)) {
      newErrors.phone = 'Duplicate phone number found';
    }

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

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formattedData = {
      ...formData,
      parentId: formData.parentId.trim(),
      password: formData.password.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      // childrenCount is already a number
      address: formData.address?.trim() || '', // Handle optional address
      image: formData.image, // Image can be null
    };

    onSave(formattedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Add New Parent</h2>
        <div className="flex flex-col gap-3">

          {/* Parent ID */}
          <div>
            <input
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              placeholder="Parent ID *"
              className={`p-2 border rounded w-full ${errors.parentId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.parentId && <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>}
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