// SchedulesModule.jsx
import React, { useState, useEffect } from 'react';
import ClassScheduleView from './ClassScheduleView';
import CreateScheduleModal from './CreateScheduleModal';
import { LayoutList, Plus } from 'lucide-react'; // Using Lucide icons for consistency

const SchedulesModule = () => {
  // Define all possible class tabs (Class 1 to Class 10)
  const classTabs = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);

  // State to manage the active tab (selected class)
  const [activeTab, setActiveTab] = useState(classTabs[0]); // Default to Class 1

  // State to manage the visibility of the Create/Edit Schedule modal
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);

  // State to hold the schedule data when editing an existing schedule
  // This will be null for creating new, and an object {id, classId, examType, date, time, subject} for editing
  const [editingSchedule, setEditingSchedule] = useState(null);

  // State to store all exam schedules in memory.
  // Each schedule object now directly contains examType, date, time, subject.
  const [allSchedules, setAllSchedules] = useState([
    // Mock Data for demonstration, matching the simplified structure
    {
      id: 'mock1',
      classId: 'Class 1',
      examType: 'Formative Assessment 1',
      date: '2025-07-10',
      time: '09:00',
      subject: 'Mathematics',
    },
    {
      id: 'mock2',
      classId: 'Class 1',
      examType: 'Formative Assessment 2',
      date: '2025-07-15',
      time: '11:00',
      subject: 'English',
    },
    {
      id: 'mock3',
      classId: 'Class 2',
      examType: 'Summative Assessment 1',
      date: '2025-07-20',
      time: '10:30',
      subject: 'Science',
    },
    {
      id: 'mock4',
      classId: 'Class 2',
      examType: 'Formative Assessment 3',
      date: '2025-07-25',
      time: '14:00',
      subject: 'History',
    },
    {
      id: 'mock5',
      classId: 'Class 3',
      examType: 'Summative Assessment 2',
      date: '2025-08-01',
      time: '09:00',
      subject: 'Geography',
    },
  ]);

  // Handler for opening the create/edit modal
  const handleCreateOrEditSchedule = (schedule = null) => {
    setEditingSchedule(schedule); // Set null for creating new, set schedule object for editing
    setShowCreateScheduleModal(true); // Open the modal
  };

  // Handler for saving a schedule (add new or update existing)
  const handleSaveSchedule = (scheduleData) => {
    if (editingSchedule) {
      // If editing an existing schedule, find it by ID and update it
      setAllSchedules(prevSchedules =>
        prevSchedules.map(s => (s.id === editingSchedule.id ? { ...s, ...scheduleData } : s))
      );
      console.log("Schedule updated successfully!");
    } else {
      // If creating a new schedule, add it to the array with a unique ID
      const newSchedule = {
        ...scheduleData,
        id: Date.now().toString(), // Simple unique ID generation for in-memory data
      };
      setAllSchedules(prevSchedules => [...prevSchedules, newSchedule]);
      console.log("Schedule added successfully!");
    }
    // Close the modal and reset editing state
    setShowCreateScheduleModal(false);
    setEditingSchedule(null);
  };

  // Handler for deleting a schedule by its ID
  const handleDeleteSchedule = (scheduleId) => {
    // Confirm deletion with the user using the browser's native confirm dialog
    // NOTE: In a production application, you should replace window.confirm with a custom modal for better UX and styling.
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setAllSchedules(prevSchedules =>
        prevSchedules.filter(s => s.id !== scheduleId)
      );
      console.log("Schedule deleted successfully!");
    }
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header and Create Schedule Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-0 flex items-center gap-3">
            <LayoutList size={36} className="text-purple-600" />
            Exam Schedules
          </h1>
          <button
            onClick={() => handleCreateOrEditSchedule(null)} // Pass null to indicate creating a new schedule
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-200 shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
          >
            <Plus className="mr-2" size={20} />
            Create Schedule
          </button>
        </div>

        {/* Navigation Tabs for Classes */}
        <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-gray-200 mb-8 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          {classTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-200 rounded-lg whitespace-nowrap
                ${activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 transform hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px] border border-gray-200">
          {/* ClassScheduleView displays schedules for the currently active class */}
          <ClassScheduleView
            allSchedules={allSchedules} // Pass all schedules from the parent state
            selectedClass={activeTab} // Pass the currently active class
            onEditSchedule={handleCreateOrEditSchedule} // Pass handler for editing a schedule
            onDeleteSchedule={handleDeleteSchedule} // Pass handler for deleting a schedule
          />
        </div>

        {/* Create/Edit Schedule Modal - rendered conditionally based on showCreateScheduleModal state */}
        {showCreateScheduleModal && (
          <CreateScheduleModal
            initialData={editingSchedule} // Pass current schedule data for editing, null for creating
            onClose={() => {
              setShowCreateScheduleModal(false); // Close the modal
              setEditingSchedule(null); // Reset editing state when modal closes
            }}
            onSave={handleSaveSchedule} // Pass the save handler
            classTabs={classTabs} // Pass the list of class tabs for the dropdown in the modal
          />
        )}
      </div>
  );
};

export default SchedulesModule;