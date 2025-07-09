// C:\Users\user\Desktop\SIMS\src\pages\admin\parents\ParentDetails.jsx
import React, { useState, useEffect } from 'react';
// Select is no longer needed here, can be removed if not used elsewhere
// import Select from 'react-select'; 

// Removed SUBJECT_OPTIONS and CLASS_OPTIONS as they are no longer needed.

function ParentDetails({ data, editable = false, onClose, onUpdate, existingParents = [] }) {
  const [formData, setFormData] = useState({
    ...data,
    childrenCount: 1, // New field, default to 1 (will be overwritten by data if present)
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        childrenCount: data.childrenCount || 1, // Ensure childrenCount is set from data or defaults to 1
        password: data.password || '',
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};
    const { parentId, name, email, phone, childrenCount, password } = formData; // Removed subject, classes
    const trimmedParentId = parentId?.trim();
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();

    if (!trimmedParentId) newErrors.parentId = 'Parent ID is required';
    if (!trimmedName) newErrors.name = 'Name is required';

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (trimmedEmail && !gmailRegex.test(trimmedEmail)) {
      newErrors.email = 'Only Gmail addresses are allowed';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Check for duplicates only if parentId is being created or if email/phone are being changed
    // Filter existing parents to exclude the current parent being edited
    if (existingParents) {
        existingParents
            .filter((p) => p.parentId !== data.parentId)
            .forEach((p) => {
                if (p.parentId?.toLowerCase() === trimmedParentId?.toLowerCase()) {
                    newErrors.parentId = 'Duplicate Parent ID found';
                }
                if (trimmedEmail && p.email?.toLowerCase() === trimmedEmail) {
                    newErrors.email = 'Duplicate Gmail ID found';
                }
                if (trimmedPhone && p.phone === trimmedPhone) {
                    newErrors.phone = 'Duplicate phone number found';
                }
            });
    }

    // Validate Children Count
    if (childrenCount < 1 || childrenCount > 3) {
      newErrors.childrenCount = 'Children count must be between 1 and 3';
    }

    // Password validation (only in editable mode)
    if (editable && (!password || password.length < 6)) {
      newErrors.password = 'Password must be at least 6 characters';
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

    const updatedData = {
      ...formData,
      // Trim string fields
      parentId: formData.parentId?.trim(),
      name: formData.name?.trim(),
      email: formData.email?.trim().toLowerCase(), // Store email in lowercase
      phone: formData.phone?.trim(),
      address: formData.address?.trim() || '', // Handle optional address
      // childrenCount is already a number
    };

    onUpdate(updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editable ? 'Edit Parent Details' : 'Parent Details'}
        </h2>

        <div className="flex flex-col gap-3">
          {/* Parent ID field (always rendered) */}
          <div>
            <input
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              disabled={!editable || (editable && data.parentId)}
              placeholder="Parent ID *"
              className={`p-2 border rounded w-full ${
                errors.parentId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.parentId && (
              <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>
            )}
          </div>

          {/* Password Field (only in editable mode) */}
          {editable && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password *"
                className={`p-2 border rounded w-full ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {/* Other fields (name, email, phone, address) */}
          {['name', 'email', 'phone', 'address'].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!editable}
                placeholder={
                  `${field.charAt(0).toUpperCase() + field.slice(1)} ${
                    ['name'].includes(field) ? '*' : ''
                  }`
                }
                className={`p-2 border rounded w-full ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
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
              disabled={!editable}
            />
            {errors.childrenCount && <p className="text-red-500 text-sm mt-1">{errors.childrenCount}</p>}
          </div>

          {/* Removed Subject Select */}
          {/* Removed Class Select */}

          {/* Image Upload */}
          {editable && (
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    setFormData((prev) => ({
                      ...prev,
                      image: URL.createObjectURL(file),
                    }));
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded cursor-pointer bg-gray-50 hover:bg-gray-100 text-center"
                onClick={() => document.getElementById('fileInputEdit').click()}
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <p className="text-gray-600 text-sm">Drag & drop or click to upload</p>
                )}
              </div>
              <input
                id="fileInputEdit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}

          {!editable && formData.image && (
            <img
              src={formData.image}
              alt="Parent"
              className="w-24 h-24 rounded-full object-cover mx-auto mt-3"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Close</button>
          {editable && (
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentDetails;