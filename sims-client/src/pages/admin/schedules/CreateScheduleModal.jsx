// CreateScheduleModal.jsx
import React, { useState, useEffect } from 'react';

// Define possible exam types for consistency
const ExamTypes = [
  "Formative Assessment 1", "Formative Assessment 2", "Formative Assessment 3",
  "Summative Assessment 1", "Summative Assessment 2", "Summative Assessment 3"
];

// This component is a modal for creating or editing an exam schedule.
// It receives initialData if it's in edit mode, otherwise it's for creating.
const CreateScheduleModal = ({ initialData, onClose, onSave, classTabs }) => {
  // Main form data state
  const [formData, setFormData] = useState({
    classId: initialData?.classId || classTabs[0],
    examType: initialData?.examType || '',
    // subjectSlots will now be an array of { subject: string, date: string, time: string }
    subjectSlots: initialData?.subjectSlots || [],
  });

  // States for the individual new subject slot inputs (before adding to subjectSlots array)
  const [newSubject, setNewSubject] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // States for validation errors
  const [errors, setErrors] = useState({}); // For main form fields
  const [newSlotErrors, setNewSlotErrors] = useState({}); // For the "add new slot" fields

  // Effect to populate form data when in edit mode or reset for create mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        classId: initialData.classId,
        examType: initialData.examType,
        subjectSlots: initialData.subjectSlots || [],
      });
    } else {
      // Reset form data for a new schedule
      setFormData({
        classId: classTabs[0],
        examType: '',
        subjectSlots: [],
      });
    }
    // Clear temporary input fields and errors on initialData change
    setNewSubject('');
    setNewDate('');
    setNewTime('');
    setErrors({});
    setNewSlotErrors({});
  }, [initialData, classTabs]); // Depend on initialData and classTabs

  // Handle changes for main form fields (classId, examType)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the specific field as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate the inputs for a new subject slot before adding it to the array
  const validateNewSlotInputs = () => {
    let currentErrors = {};
    if (!newSubject.trim()) currentErrors.newSubject = 'Subject cannot be empty.';
    if (!newDate) currentErrors.newDate = 'Date is required.';
    if (!newTime) currentErrors.newTime = 'Time is required.';
    setNewSlotErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  // Handler to add a new subject slot to the formData's subjectSlots array
  const handleAddSubjectSlot = () => {
    if (validateNewSlotInputs()) {
      setFormData(prev => ({
        ...prev,
        subjectSlots: [...prev.subjectSlots, { subject: newSubject, date: newDate, time: newTime }]
      }));
      // Clear inputs for the next new slot
      setNewSubject('');
      setNewDate('');
      setNewTime('');
      setNewSlotErrors({}); // Clear errors for new slot inputs
      setErrors(prev => ({ ...prev, subjectSlots: '' })); // Clear general subjectSlots error if it existed
    }
  };

  // Handler to remove a subject slot by its index
  const handleRemoveSubjectSlot = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      subjectSlots: prev.subjectSlots.filter((_, index) => index !== indexToRemove)
    }));
    // Re-validate subjectSlots if it becomes empty
    if (formData.subjectSlots.length - 1 === 0) { // If it will become empty after removal
      setErrors(prev => ({ ...prev, subjectSlots: 'At least one subject slot is required.' }));
    }
  };

  // Validate the main form fields before submitting the entire schedule
  const validateForm = () => {
    let newErrors = {};
    if (!formData.classId) newErrors.classId = 'Class is required.';
    if (!formData.examType) newErrors.examType = 'Exam Type is required.';
    if (formData.subjectSlots.length === 0) newErrors.subjectSlots = 'At least one subject slot is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Pass the complete formData (including subjectSlots array) to the parent's onSave function
      onSave(formData);
    }
  };

  return (
    // Modal overlay and container
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Modal Header */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          {initialData ? 'Edit Exam Schedule' : 'Create New Exam Schedule'}
        </h2>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl transition-colors duration-200"
          title="Close"
        >
          &times;
        </button>

        {/* Schedule Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Exam Type Select */}
          <div>
            <label htmlFor="examType" className="block text-sm font-semibold text-gray-700 mb-1">
              Exam Type
            </label>
            <select
              id="examType"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${errors.examType ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            >
              <option value="">Select Exam Type</option>
              {ExamTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.examType && <p className="mt-1 text-sm text-red-600">{errors.examType}</p>}
          </div>

          {/* Class Select */}
          <div>
            <label htmlFor="classId" className="block text-sm font-semibold text-gray-700 mb-1">
              Class
            </label>
            <select
              id="classId"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${errors.classId ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            >
              {classTabs.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            {errors.classId && <p className="mt-1 text-sm text-red-600">{errors.classId}</p>}
          </div>

          {/* Current Subject Slots Display */}
          {formData.subjectSlots.length > 0 && (
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Scheduled Subjects:</h3>
              <ul className="space-y-2">
                {formData.subjectSlots.map((slot, index) => (
                  <li key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                    <span className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">{slot.subject}</span> - {slot.date} at {slot.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubjectSlot(index)}
                      className="text-red-500 hover:text-red-700 ml-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1 transition-colors duration-200"
                      title="Remove Subject Slot"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors.subjectSlots && <p className="mt-1 text-sm text-red-600">{errors.subjectSlots}</p>}


          {/* Add New Subject Slot Section */}
          <div className="border-t pt-5 mt-5 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Subject Slot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div className="col-span-full md:col-span-1">
                <label htmlFor="newSubject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="newSubject"
                  name="newSubject"
                  value={newSubject}
                  onChange={(e) => {
                    setNewSubject(e.target.value);
                    if (newSlotErrors.newSubject) setNewSlotErrors(prev => ({ ...prev, newSubject: '' }));
                  }}
                  placeholder="e.g., Mathematics"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${newSlotErrors.newSubject ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
                />
                {newSlotErrors.newSubject && <p className="mt-1 text-sm text-red-600">{newSlotErrors.newSubject}</p>}
              </div>

              <div className="col-span-full sm:col-span-1 md:col-span-1">
                <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="newDate"
                  name="newDate"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    if (newSlotErrors.newDate) setNewSlotErrors(prev => ({ ...prev, newDate: '' }));
                  }}
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${newSlotErrors.newDate ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
                />
                {newSlotErrors.newDate && <p className="mt-1 text-sm text-red-600">{newSlotErrors.newDate}</p>}
              </div>

              <div className="col-span-full sm:col-span-1 md:col-span-1">
                <label htmlFor="newTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="newTime"
                  name="newTime"
                  value={newTime}
                  onChange={(e) => {
                    setNewTime(e.target.value);
                    if (newSlotErrors.newTime) setNewSlotErrors(prev => ({ ...prev, newTime: '' }));
                  }}
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${newSlotErrors.newTime ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
                />
                {newSlotErrors.newTime && <p className="mt-1 text-sm text-red-600">{newSlotErrors.newTime}</p>}
              </div>

              <div className="col-span-full md:col-span-1 flex justify-end md:justify-start">
                <button
                  type="button"
                  onClick={handleAddSubjectSlot}
                  className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 ease-in-out font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Add Subject Slot
                </button>
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out font-medium shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {initialData ? 'Update Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default CreateScheduleModal;
