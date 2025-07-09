import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

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

function TeacherDetails({ data, editable = false, onClose, onUpdate, existingTeachers = [] }) {
  const [formData, setFormData] = useState({
    ...data,
    subjects_taught: [],
    assigned_classes: [],
    class_teacher: null,
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        subjects_taught: data.subjects_taught?.map((s) => ({ label: s, value: s })) || [],
        assigned_classes: data.assigned_classes?.map((c) => ({ label: c, value: c })) || [],
        class_teacher: data.class_teacher ? CLASS_OPTIONS.find(c => c.value === data.class_teacher) : null,
        password: data.password || '',
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};
    const { user_id, full_name, email, phone, subjects_taught, assigned_classes, class_teacher, password } = formData;
    const trimmedUserId = user_id?.trim();
    const trimmedName = full_name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();

    if (!trimmedUserId) newErrors.user_id = 'User ID is required';
    if (!trimmedName) newErrors.full_name = 'Name is required';

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

    if (!class_teacher) newErrors.class_teacher = 'Class Teacher is required';

    if (!data.user_id || (data.user_id && (trimmedUserId?.toLowerCase() !== data.user_id?.toLowerCase() || trimmedEmail !== data.email?.toLowerCase() || trimmedPhone !== data.phone))) {
      existingTeachers
        .filter((t) => t.user_id !== data.user_id)
        .forEach((t) => {
          if (t.user_id.toLowerCase() === trimmedUserId?.toLowerCase()) {
            newErrors.user_id = 'Duplicate User ID found';
          }
          if (trimmedEmail && t.email?.toLowerCase() === trimmedEmail) {
            newErrors.email = 'Duplicate Gmail ID found';
          }
          if (trimmedPhone && t.phone === trimmedPhone) {
            newErrors.phone = 'Duplicate phone number found';
          }
        });
    }

    if (subjects_taught.length < 1) newErrors.subjects_taught = 'At least 1 subject is required';
    if (assigned_classes.length < 1) newErrors.assigned_classes = 'At least 1 class is required';

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async () => {
    // if (!validateForm()) return;
    try{
      const token = JSON.parse(localStorage.getItem('authToken'));
      if (!token) {
        console.error('Authentication token not found.');
        return;
      }
      const updatedData = {
      ...formData,

      user_id: formData.user_id.trim(),
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address?.trim() || '',
      subjects_taught: formData.subjects_taught.map((s) => s.value),
      assigned_classes: formData.assigned_classes.map((c) => c.value),
      class_teacher: formData.class_teacher.value,
      // password: formData.password,
    };
    await axios.put(`http://localhost:5000/api/teachers/${formData._id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    onUpdate(updatedData);
    onClose();
    }catch(err){
      console.error('Error fetching teacher:', err);
      setErrors('Failed to fetch teacher. Please try again later.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editable ? 'Edit Teacher Details' : 'Teacher Details'}
        </h2>

        <div className="flex flex-col gap-3">
          <div>
            <input
              name="empId"
              value={formData.user_id}
              onChange={handleChange}
              disabled={!editable || (editable && data.user_id)}
              placeholder="Teacher EMP ID *"
              className={`p-2 border rounded w-full ${errors.user_id ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.user_id && (
              <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
            )}
          </div>

          {editable && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password *"
                className={`p-2 border rounded w-full ${errors.password ? 'border-red-500' : 'border-gray-300'
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

          {['full_name', 'email', 'phone', 'address'].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!editable}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                className={`p-2 border rounded w-full ${errors[field] ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Subjects (1–5) *</label>
            <Select
              isMulti
              options={SUBJECT_OPTIONS}
              value={formData.subjects_taught}
              onChange={handleSubjectChange}
              placeholder="Select subjects..."
              isDisabled={!editable}
            />
            {errors.subjects_taught && <p className="text-red-500 text-sm mt-1">{errors.subjects_taught}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assigned Classes *</label>
            <Select
              isMulti
              options={CLASS_OPTIONS}
              value={formData.assigned_classes}
              onChange={handleClassChange}
              placeholder="Select classes..."
              isDisabled={!editable}
            />
            {errors.assigned_classes && <p className="text-red-500 text-sm mt-1">{errors.assigned_classes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class Teacher *</label>
            <Select
              options={CLASS_OPTIONS}
              value={formData.class_teacher}
              onChange={handleClassTeacherChange}
              placeholder="Select class teacher..."
              isDisabled={!editable}
            />
            {errors.class_teacher && <p className="text-red-500 text-sm mt-1">{errors.class_teacher}</p>}
          </div>

          {editable && (
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image *</label>
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
              alt="Teacher"
              className="w-24 h-24 rounded-full object-cover mx-auto mt-3"
            />
          )}
        </div>

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

export default TeacherDetails;