// SchedulesModule.jsx
import React, { useState, useEffect } from 'react';
import ClassScheduleView from './ClassScheduleView';
import CreateScheduleModal from './CreateScheduleModal';
import { LayoutList, Plus } from 'lucide-react'; // Using Lucide icons for consistency
import axios from 'axios'; // Import axios

const SchedulesModule = () => {
  // Define all possible class tabs (Class 1 to Class 10)
  const classTabs = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);

  // State to manage the active tab (selected class)
  const [activeTab, setActiveTab] = useState(classTabs[0]); // Default to Class 1

  // State to manage the visibility of the Create/Edit Schedule modal
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);

  // State to hold the schedule data when editing an existing schedule
  // This will be null for creating new, and an object { _id, classId, examType, subjectSlots } for editing
  const [editingSchedule, setEditingSchedule] = useState(null);

  // State to store all exam schedules in memory.
  // Each schedule object contains classId, examType, subjectSlots (array of {subject, date, time})
  const [allSchedules, setAllSchedules] = useState([]);

  // Handler for opening the create/edit modal
  const handleCreateOrEditSchedule = (schedule = null) => {
    setEditingSchedule(schedule); // Set null for creating new, set schedule object for editing
    setShowCreateScheduleModal(true); // Open the modal
  };

  // Handler for saving a schedule (add new or update existing)
  const handleSaveSchedule = async (scheduleData) => {
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      if (editingSchedule) {
        // Update existing schedule
        const response = await axios.put(
          `http://localhost:5000/api/exam-schedule/${editingSchedule._id}`,
          scheduleData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllSchedules(prevSchedules =>
          prevSchedules.map(s => s._id === editingSchedule._id ? response.data.data : s)
        );
      } else {
        // Create new schedule
        const response = await axios.post(
          'http://localhost:5000/api/exam-schedule/',
          scheduleData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllSchedules(prevSchedules => [...prevSchedules, response.data.data]);
      }
      setShowCreateScheduleModal(false);
      setEditingSchedule(null);
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule. Please try again.");
    }
  };

  // Handler for deleting a schedule by its ID
  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        await axios.delete(`http://localhost:5000/api/exam-schedule/${scheduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllSchedules(prevSchedules =>
          prevSchedules.filter(s => s._id !== scheduleId)
        );
        console.log("Schedule deleted successfully!");
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert("Failed to delete schedule. Please try again.");
      }
    }
  };

  // Fetch schedules from backend on mount
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        const response = await axios.get('http://localhost:5000/api/exam-schedule/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // The backend returns { success, count, data: [schedules] }
        setAllSchedules(response.data.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Header and Create Schedule Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-0 flex items-center gap-3">
          <LayoutList size={36} className="text-purple-600" />
          Exam Schedules
        </h1>
        <button
          onClick={() => handleCreateOrEditSchedule(null)}
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
