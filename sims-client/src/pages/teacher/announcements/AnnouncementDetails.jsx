import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useAnnouncements } from './AnnouncementProvider'; // Import the hook

const targetOptions = [
  { value: 'All', label: 'All' },
  { value: 'Students', label: 'Students' },
  { value: 'Teachers', label: 'Teachers' },
  { value: 'Parents', label: 'Parents' },
  { value: 'Staff', label: 'Staff' }
];

function AnnouncementDetails({ data, editable = false, onClose }) { // Remove onUpdate prop
  const { handleUpdateAnnouncement } = useAnnouncements(); // Get handler from context

  console.log('announcement data ', data);
  const [formData, setFormData] = useState({
    // ...data,
    // target: [],
    // startDate: new Date(data.startDate),
    // endDate: new Date(data.endDate)
    title: data.title,
    content: data.content,
    target: data.target,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status
  });

  const [errors, setErrors] = useState({});


  // Initialize form data
  React.useEffect(() => {
    if (data) {
      setFormData({
        // ...data,
        // target: data.target.map(t => targetOptions.find(option => option.value === t)),
        // startDate: new Date(data.startDate),
        // endDate: new Date(data.endDate)
        title: data.title,
        content: data.content,
        target: data.target.map(t => targetOptions.find(option => option.value === t)),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status
      });
    }
  }, [data]);
  console.log('form data ', formData.target);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.target.length === 0) newErrors.target = 'At least one target is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.endDate < formData.startDate) newErrors.endDate = 'End date must be after start date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTargetChange = (selected) => {
    setFormData(prev => ({ ...prev, target: selected }));
    setErrors(prev => ({ ...prev, target: '' }));
  };

  const handleSubmit = async() => {
    if (!validateForm()) return;

    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      const updatedAnnouncement = {
        // ...formData,
        // target: formData.target.map(t => t.value),
        // startDate: formData.startDate.toISOString().split('T')[0],
        // endDate: formData.endDate.toISOString().split('T')[0]
        title: formData.title.trim(),
        content: formData.content.trim(),
        target: formData.target.map(t => t.value),
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
        status: formData.status,
      };
  
      await axios.put(`http://localhost:5000/api/announcements/${data._id}`, updatedAnnouncement,{
        headers: { Authorization: `Bearer ${token}` }
      });
      handleUpdateAnnouncement(updatedAnnouncement); // Use context handler
      onClose();
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          {editable ? 'Edit Announcement' : 'Announcement Details'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!editable}
              className={`p-2 border rounded w-full ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              disabled={!editable}
              className={`p-2 border rounded w-full ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
            ></textarea>
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Audience *</label>
            <Select
              name="target"
              isMulti
              options={targetOptions}
              value={formData.target}
              onChange={handleTargetChange}
              classNamePrefix="react-select"
              isDisabled={!editable}
              className={`${errors.target ? 'border-red-500 rounded' : ''}`}
            />
            {errors.target && <p className="text-red-500 text-sm mt-1">{errors.target}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, startDate: date }));
                  setErrors(prev => ({ ...prev, startDate: '' }));
                }}
                disabled={!editable}
                className={`p-2 border rounded w-full ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, endDate: date }));
                  setErrors(prev => ({ ...prev, endDate: '' }));
                }}
                minDate={formData.startDate}
                disabled={!editable}
                className={`p-2 border rounded w-full ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!editable}
              className="p-2 border rounded w-full"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {!editable && (
            <div>
              <label className="block text-sm font-medium mb-1">Created At</label>
              <div className="p-2 bg-gray-100 rounded text-sm">
                {new Date(formData.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Close</button>
          {editable && (
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetails;