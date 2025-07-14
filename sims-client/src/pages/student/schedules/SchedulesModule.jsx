// SchedulesModule.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RegularScheduleViewStudent from './RegularScheduleViewStudent';
import ExamScheduleViewTeacher from '../../teacher/schedules/ExamScheduleViewTeacher';
import { CalendarDays } from 'lucide-react'; // Assuming you're using lucide-react for icons

const SchedulesModule = () => {
  // Define tabs for the student panel
  const tabs = ["Regular Schedule", "Exam Schedule"];
  const [activeTab, setActiveTab] = useState(tabs[0]); // Default to "Regular Schedule"

  const currentStudentClasses = ["Class 1", "Class 3", "Class 5"]; // Example: Student is enrolled in these classes

  // In-memory state for ALL teachers' regular schedules.
  // The student view will filter this based on currentStudentClasses.
  const [allTeachersRegularSchedules, setAllTeachersRegularSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('authToken'));
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (activeTab === "Regular Schedule") {
      setLoading(true);
      setError(null);
      axios.get('http://localhost:5000/api/teacher/schedules/', { headers })
        .then(res => {
          setAllTeachersRegularSchedules(res.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch schedules');
          setLoading(false);
        });
    }
    if (activeTab === "Exam Schedule") {
      setLoading(true);
      setError(null);
      axios.get('http://localhost:5000/api/exam-schedule/', { headers, withCredentials: true })
        .then(res => {
          if (res.data.success) {
            // Flatten subjectSlots for student view
            const flat = res.data.data.flatMap(sch =>
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
        .catch(() => {
          setError('Failed to fetch exam schedules');
          setLoading(false);
        });
    }
  }, [activeTab]);

  // In-memory state for admin-provided exam schedules (read-only for students)
  const [adminExamSchedules, setAdminExamSchedules] = useState([]);

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        <div className="flex items-center gap-3">
          <CalendarDays size={32} className="text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Class & Exam Schedules
          </h1>
        </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6 sticky top-0 bg-gray-50 z-10 p-1 -mx-6 w-[calc(100%+3rem)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition duration-200 ease-in-out text-sm md:text-base
              ${activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-lg shadow p-6 min-h-[400px]">
        {activeTab === "Regular Schedule" && (
          loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <RegularScheduleViewStudent
              allTeachersRegularSchedules={allTeachersRegularSchedules}
              currentStudentClasses={currentStudentClasses}
            />
          )
        )}
        {activeTab === "Exam Schedule" && (
          loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <ExamScheduleViewTeacher
              adminExamSchedules={adminExamSchedules}
            />
          )
        )}
      </div>
    </div>
  );
};

export default SchedulesModule;
