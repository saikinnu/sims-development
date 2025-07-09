// SchedulesModule.jsx
import React, { useState } from 'react';
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
  const [allTeachersRegularSchedules] = useState([
    // Mock Data for demonstration from various teachers and classes
    { id: 'trs1', teacherId: 'teacher_T123', dayOfWeek: 'Monday', startTime: '09:00', endTime: '09:45', subject: 'Mathematics', classId: 'Class 1' },
    { id: 'trs2', teacherId: 'teacher_T123', dayOfWeek: 'Monday', startTime: '10:00', endTime: '10:45', subject: 'Science', classId: 'Class 2' },
    { id: 'trs3', teacherId: 'teacher_T123', dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '11:45', subject: 'English', classId: 'Class 1' },
    { id: 'trs4', teacherId: 'teacher_T124', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '09:45', subject: 'Physics', classId: 'Class 10' },
    { id: 'trs5', teacherId: 'teacher_T125', dayOfWeek: 'Monday', startTime: '08:00', endTime: '08:45', subject: 'History', classId: 'Class 3' },
    { id: 'trs6', teacherId: 'teacher_T126', dayOfWeek: 'Thursday', startTime: '13:00', endTime: '13:45', subject: 'Chemistry', classId: 'Class 5' },
    { id: 'trs7', teacherId: 'teacher_T123', dayOfWeek: 'Friday', startTime: '15:00', endTime: '15:45', subject: 'Art', classId: 'Class 1' },
  ]);

  // In-memory state for admin-provided exam schedules (read-only for students)
  const [adminExamSchedules, setAdminExamSchedules] = useState([
    // Mock Data for demonstration (consistent with Admin's data structure)
    { id: 'adm_exam1', classId: 'Class 1', examType: 'Formative Assessment 1', date: '2025-07-10', time: '09:00', subject: 'Mathematics' },
    { id: 'adm_exam2', classId: 'Class 1', examType: 'Formative Assessment 2', date: '2025-07-15', time: '11:00', subject: 'English' },
    { id: 'adm_exam3', classId: 'Class 2', examType: 'Summative Assessment 1', date: '2025-07-20', time: '10:30', subject: 'Science' },
    { id: 'adm_exam4', classId: 'Class 3', examType: 'Formative Assessment 1', date: '2025-07-22', time: '09:30', subject: 'History' },
    { id: 'adm_exam5', classId: 'Class 5', examType: 'Summative Assessment 1', date: '2025-08-01', time: '13:00', subject: 'Physics' },
    { id: 'adm_exam6', classId: 'Class 3', examType: 'Summative Assessment 2', date: '2025-08-05', time: '11:00', subject: 'Geography' },
  ]);

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
          <RegularScheduleViewStudent
            allTeachersRegularSchedules={allTeachersRegularSchedules}
            currentStudentClasses={currentStudentClasses} // Pass student's enrolled classes
          />
        )}
        {activeTab === "Exam Schedule" && (
          <ExamScheduleViewTeacher // Reusing the teacher's read-only exam view
            adminExamSchedules={adminExamSchedules}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulesModule;
