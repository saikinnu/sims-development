// CreateRegularScheduleModal.jsx
import React, { useState, useEffect } from 'react';

// Define days of the week for the dropdown
const DaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CreateRegularScheduleModal = ({ initialData, onClose, onSave, classTabs }) => {
  // Main form data state, now including subjectSlots for multiple subjects
  const [formData, setFormData] = useState({
    dayOfWeek: initialData?.dayOfWeek || DaysOfWeek[0],
    classId: initialData?.classId || classTabs[0], // Class is part of the main schedule entry
    subjectSlots: initialData?.subjectSlots || [], // Array of { subject, startTime, endTime }
  });

  // States for the individual new subject slot inputs (before adding to subjectSlots array)
  const [newSubject, setNewSubject] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  // States for validation errors
  const [errors, setErrors] = useState({}); // For main form fields (dayOfWeek, classId, subjectSlots overall)
  const [newSlotErrors, setNewSlotErrors] = useState({}); // For the "add new slot" fields (newSubject, newStartTime, newEndTime)

  // Effect to populate form data when in edit mode or reset for create mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        dayOfWeek: initialData.dayOfWeek,
        classId: initialData.classId,
        subjectSlots: initialData.subjectSlots || [],
      });
    } else {
      // Reset form data for a new schedule entry
      setFormData({
        dayOfWeek: DaysOfWeek[0],
        classId: classTabs[0],
        subjectSlots: [],
      });
    }
    // Clear temporary input fields and errors on initialData change
    setNewSubject('');
    setNewStartTime('');
    setNewEndTime('');
    setErrors({});
    setNewSlotErrors({});
  }, [initialData, classTabs]); // Depend on initialData and classTabs

  // Handle changes for main form fields (dayOfWeek, classId)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the specific field being changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate the inputs for a new subject slot before adding it to the array
  const validateNewSlotInputs = () => {
    let currentErrors = {};
    if (!newSubject.trim()) currentErrors.newSubject = 'Subject cannot be empty.';
    if (!newStartTime) currentErrors.newStartTime = 'Start time is required.';
    if (!newEndTime) currentErrors.newEndTime = 'End time is required.';

    // Basic time validation: end time must be after start time
    if (newStartTime && newEndTime) {
      const start = new Date(`1970/01/01T${newStartTime}`);
      const end = new Date(`1970/01/01T${newEndTime}`);
      if (end <= start) {
        currentErrors.newEndTime = 'End time must be after start time.';
      }
    }
    setNewSlotErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  // Handler to add a new subject slot to the formData's subjectSlots array
  const handleAddSubjectSlot = () => {
    if (validateNewSlotInputs()) {
      setFormData(prev => ({
        ...prev,
        subjectSlots: [...prev.subjectSlots, {
          subject: newSubject,
          startTime: newStartTime,
          endTime: newEndTime
        }]
      }));
      // Clear inputs for the next new slot
      setNewSubject('');
      setNewStartTime('');
      setNewEndTime('');
      setNewSlotErrors({}); // Clear errors for new slot inputs
      setErrors(prev => ({ ...prev, subjectSlots: '' })); // Clear general subjectSlots error if it existed
    } else {
      console.log("Validation failed for new subject slot:", newSlotErrors);
    }
  };

  // Handler to remove a subject slot by its index
  const handleRemoveSubjectSlot = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      subjectSlots: prev.subjectSlots.filter((_, index) => index !== indexToRemove)
    }));
    // Re-validate subjectSlots if it becomes empty after removal
    if (formData.subjectSlots.length - 1 === 0) {
      setErrors(prev => ({ ...prev, subjectSlots: 'At least one subject slot is required.' }));
    }
  };

  // Validate the main form fields before submitting the entire schedule entry
  const validateForm = () => {
    let newErrors = {};
    if (!formData.dayOfWeek) newErrors.dayOfWeek = 'Day of week is required.';
    if (!formData.classId) newErrors.classId = 'Class is required.';
    if (formData.subjectSlots.length === 0) newErrors.subjectSlots = 'At least one subject slot is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Pass the complete formData (including dayOfWeek, classId, and subjectSlots array) to the parent's onSave function
      onSave(formData);
    } else {
      console.log("Form validation failed:", errors); // Log errors if main form validation fails
    }
  };

  return (
    // Modal overlay and container for responsive centering
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-8 relative transform scale-95 animate-scale-in"> {/* Increased max-w to 4xl */}
        {/* Modal Header */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          {initialData ? 'Edit Regular Schedule' : 'Create New Regular Schedule'}
        </h2>
        {/* Close button (top right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl transition-colors duration-200"
          title="Close"
        >
          &times;
        </button>

        {/* Schedule Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Day of Week Select */}
          <div>
            <label htmlFor="dayOfWeek" className="block text-sm font-semibold text-gray-700 mb-1">
              Day of Week
            </label>
            <select
              id="dayOfWeek"
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${errors.dayOfWeek ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
            >
              {DaysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            {errors.dayOfWeek && <p className="mt-1 text-sm font-bold text-red-600">{errors.dayOfWeek}</p>}
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
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${errors.classId ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
            >
              {classTabs.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            {errors.classId && <p className="mt-1 text-sm font-bold text-red-600">{errors.classId}</p>}
          </div>

          {/* Current Subject Slots Display */}
          {formData.subjectSlots.length > 0 && (
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Scheduled Subjects for this Day:</h3>
              <ul className="space-y-2">
                {formData.subjectSlots.map((slot, index) => (
                  <li key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                    <span className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">{slot.subject}</span> ({slot.startTime} - {slot.endTime})
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
          {errors.subjectSlots && <p className="mt-1 text-sm font-bold text-red-600">{errors.subjectSlots}</p>}


          {/* Add New Subject Slot Section */}
          <div className="border-t pt-5 mt-5 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Subject Slot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end"> {/* Adjusted grid for 3 inputs + button */}
              <div>
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
                  placeholder="e.g., Algebra"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${newSlotErrors.newSubject ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                />
                {newSlotErrors.newSubject && <p className="mt-1 text-sm font-bold text-red-600">{newSlotErrors.newSubject}</p>}
              </div>

              <div>
                <label htmlFor="newStartTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="newStartTime"
                  name="newStartTime"
                  value={newStartTime}
                  onChange={(e) => {
                    setNewStartTime(e.target.value);
                    if (newSlotErrors.newStartTime) setNewSlotErrors(prev => ({ ...prev, newStartTime: '' }));
                  }}
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${newSlotErrors.newStartTime ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                />
                {newSlotErrors.newStartTime && <p className="mt-1 text-sm font-bold text-red-600">{newSlotErrors.newStartTime}</p>}
              </div>

              <div>
                <label htmlFor="newEndTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="newEndTime"
                  name="newEndTime"
                  value={newEndTime}
                  onChange={(e) => {
                    setNewEndTime(e.target.value);
                    if (newSlotErrors.newEndTime) setNewSlotErrors(prev => ({ ...prev, newEndTime: '' }));
                  }}
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${newSlotErrors.newEndTime ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                />
                {newSlotErrors.newEndTime && <p className="mt-1 text-sm font-bold text-red-600">{newSlotErrors.newEndTime}</p>}
              </div>

              <div className="col-span-full md:col-span-1 flex justify-end md:justify-start"> {/* Realigned button */}
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
    </div>
  );
};

export default CreateRegularScheduleModal;
