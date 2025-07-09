import React, { useState } from 'react';
import RegularScheduleView from './RegularScheduleView';
import ExamScheduleViewTeacher from './ExamScheduleViewTeacher';
import CreateRegularScheduleModal from './CreateRegularScheduleModal';
import { FiPlus } from 'react-icons/fi';
import { CalendarDays } from 'lucide-react';

const SchedulesModule = () => {
  // Constants
  const TABS = ["Regular Schedule", "Exam Schedule"];
  const CURRENT_TEACHER_ID = "teacher_T123"; // Replace with actual auth in production

  // State management
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Mock data - in a real app, these would come from API calls
  const [teacherRegularSchedules, setTeacherRegularSchedules] = useState([
    { id: 'trs1', teacherId: 'teacher_T123', dayOfWeek: 'Monday', startTime: '09:00', endTime: '09:45', subject: 'Mathematics', classId: 'Class 1' },
    { id: 'trs2', teacherId: 'teacher_T123', dayOfWeek: 'Monday', startTime: '10:00', endTime: '10:45', subject: 'Science', classId: 'Class 2' },
    { id: 'trs3', teacherId: 'teacher_T123', dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '11:45', subject: 'English', classId: 'Class 1' },
    { id: 'trs4', teacherId: 'teacher_T124', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '09:45', subject: 'Physics', classId: 'Class 10' },
  ]);

  const [adminExamSchedules] = useState([
    { id: 'adm_exam1', classId: 'Class 1', examType: 'Formative Assessment 1', date: '2025-07-10', time: '09:00', subject: 'Mathematics' },
    { id: 'adm_exam2', classId: 'Class 1', examType: 'Formative Assessment 2', date: '2025-07-15', time: '11:00', subject: 'English' },
    { id: 'adm_exam3', classId: 'Class 2', examType: 'Summative Assessment 1', date: '2025-07-20', time: '10:30', subject: 'Science' },
    { id: 'adm_exam4', classId: 'Class 2', examType: 'Formative Assessment 3', date: '2025-07-25', time: '14:00', subject: 'History' },
    { id: 'adm_exam5', classId: 'Class 3', examType: 'Summative Assessment 2', date: '2025-08-01', time: '09:00', subject: 'Geography' },
  ]);

  // Handlers
  const handleCreateOrEditSchedule = (schedule = null) => {
    setEditingSchedule(schedule);
    setShowCreateModal(true);
  };

  const handleSaveSchedule = (scheduleData) => {
    if (editingSchedule) {
      setTeacherRegularSchedules(prev => 
        prev.map(s => s.id === editingSchedule.id ? { ...s, ...scheduleData } : s)
      );
    } else {
      setTeacherRegularSchedules(prev => [
        ...prev,
        {
          ...scheduleData,
          id: `trs${Date.now()}`,
          teacherId: CURRENT_TEACHER_ID,
        }
      ]);
    }
    setShowCreateModal(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setTeacherRegularSchedules(prev => 
        prev.filter(s => s.id !== scheduleId)
      );
    }
  };

  // Filter current teacher's schedules
  const currentTeacherSchedules = teacherRegularSchedules.filter(
    s => s.teacherId === CURRENT_TEACHER_ID
  );

  return (
    <div className="px-0 sm:px-4 lg:px-6 py-4 space-y-6">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays size={32} className="text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Class & Exam Schedules
          </h1>
        </div>
        
        {activeTab === TABS[0] && (
          <button
            onClick={() => handleCreateOrEditSchedule()}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            aria-label="Create new schedule"
          >
            <FiPlus size={18} />
            <span>Create Regular Schedule</span>
          </button>
        )}
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex space-x-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium relative transition-colors duration-200
                ${
                  activeTab === tab
                    ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="bg-white rounded-lg shadow p-6 min-h-[400px]">
        {activeTab === TABS[0] ? (
          <RegularScheduleView
            teacherRegularSchedules={currentTeacherSchedules}
            onEditRegularSchedule={handleCreateOrEditSchedule}
            onDeleteRegularSchedule={handleDeleteSchedule}
          />
        ) : (
          <ExamScheduleViewTeacher
            adminExamSchedules={adminExamSchedules}
          />
        )}
      </main>

      {/* Modal */}
      {showCreateModal && (
        <CreateRegularScheduleModal
          initialData={editingSchedule}
          onClose={() => {
            setShowCreateModal(false);
            setEditingSchedule(null);
          }}
          onSave={handleSaveSchedule}
          classOptions={Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)}
        />
      )}
    </div>
  );
};

export default SchedulesModule;