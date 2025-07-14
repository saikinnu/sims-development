import React, { useState, useEffect } from 'react';
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
  const [teacherRegularSchedules, setTeacherRegularSchedules] = useState([]);
  const [adminExamSchedules, setAdminExamSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch teacher regular schedules from backend
  useEffect(() => {
    if (activeTab === TABS[0]) {
      setLoading(true);
      fetch(`http://localhost:5000/api/teacher/schedules/${CURRENT_TEACHER_ID}`)
        .then(res => res.json())
        .then(data => {
          setTeacherRegularSchedules(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch schedules');
          setLoading(false);
        });
    }
  }, [activeTab, showCreateModal, CURRENT_TEACHER_ID]);

  // Fetch exam schedules from backend
  useEffect(() => {
    if (activeTab === TABS[1]) {
      setLoading(true);
      fetch('http://localhost:5000/api/exam-schedule', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            // Flatten subjectSlots for teacher view
            const flat = result.data.flatMap(sch =>
              sch.subjectSlots.map(slot => ({
                id: sch._id,
                classId: sch.classId,
                examType: sch.examType,
                date: slot.date,
                time: slot.time,
                subject: slot.subject
              }))
            );
            setAdminExamSchedules(flat);
          } else {
            setAdminExamSchedules([]);
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch exam schedules');
          setLoading(false);
        });
    }
  }, [activeTab]);

  // Handlers
  const handleCreateOrEditSchedule = (schedule = null) => {
    setEditingSchedule(schedule);
    setShowCreateModal(true);
  };

  const handleSaveSchedule = (scheduleData) => {
    setLoading(true);
    setError(null);

    // Only send the first subject slot
    const firstSlot = scheduleData.subjectSlots[0];
    if (!firstSlot) {
      setError('At least one subject slot is required.');
      setLoading(false);
      return;
    }

    const payload = {
      teacherId: CURRENT_TEACHER_ID,
      dayOfWeek: scheduleData.dayOfWeek,
      classId: scheduleData.classId,
      subject: firstSlot.subject,
      startTime: firstSlot.startTime,
      endTime: firstSlot.endTime,
    };

    if (editingSchedule) {
      // Update existing schedule
      fetch(`http://localhost:5000/api/teacher/schedules/${editingSchedule._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(() => {
          setShowCreateModal(false);
          setEditingSchedule(null);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to update schedule');
          setLoading(false);
        });
    } else {
      // Create new schedule
      fetch('http://localhost:5000/api/teacher/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(() => {
          setShowCreateModal(false);
          setEditingSchedule(null);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to create schedule');
          setLoading(false);
        });
    }
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:5000/api/teacher/schedules/${scheduleId}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to delete schedule');
          setLoading(false);
        });
    }
  };

  // Filter current teacher's schedules (already filtered by backend)
  const currentTeacherSchedules = teacherRegularSchedules;

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
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : activeTab === TABS[0] ? (
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
          classTabs={Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)}
        />
      )}
    </div>
  );
};

export default SchedulesModule;