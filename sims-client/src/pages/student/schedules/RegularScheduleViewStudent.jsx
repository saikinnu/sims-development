// RegularScheduleViewStudent.jsx
import React, { useState, useEffect } from 'react';

// Define days of the week in order for consistent display
const DaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const RegularScheduleViewStudent = ({ allTeachersRegularSchedules, currentStudentClasses }) => {
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const grouped = {};
    DaysOfWeek.forEach(day => {
      grouped[day] = []; // Initialize all days as empty arrays
    });

    // Filter schedules to only include those for the classes the student is enrolled in
    const studentFilteredSchedules = allTeachersRegularSchedules.filter(schedule =>
      currentStudentClasses.includes(schedule.classId)
    );

    // Group filtered schedules by day of the week
    studentFilteredSchedules.forEach(schedule => {
      if (grouped[schedule.dayOfWeek]) {
        grouped[schedule.dayOfWeek].push(schedule);
      }
    });

    // Sort schedules within each day by start time
    Object.values(grouped).forEach(daySchedules => {
      daySchedules.sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a.startTime}`);
        const timeB = new Date(`1970/01/01 ${b.startTime}`);
        return timeA - timeB;
      });
    });

    setGroupedSchedules(grouped);
    setLoading(false);
  }, [allTeachersRegularSchedules, currentStudentClasses]); // Re-run effect when these props change

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-3">Loading your regular schedules...</p>
      </div>
    );
  }

  const hasAnyRegularSchedules = Object.values(groupedSchedules).some(arr => arr.length > 0);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Regular Class Schedule</h2>

      {!hasAnyRegularSchedules && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded-lg shadow-md" role="alert">
          <p className="font-bold text-lg mb-2">No Regular Schedules Found!</p>
          <p>There are no regular class schedules available for your enrolled classes.</p>
        </div>
      )}

      {DaysOfWeek.map(day => (
        <div key={day}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{day}</h3>
          {groupedSchedules[day].length === 0 ? (
            <div className="bg-gray-50 border-l-4 border-gray-300 text-gray-700 p-4 rounded-md">
              <p>No classes scheduled for {day}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    {/* No Actions column for read-only view */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedSchedules[day].map(schedule => (
                    <tr key={schedule.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.startTime} - {schedule.endTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.classId}</td>
                      {/* No buttons for read-only view */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RegularScheduleViewStudent;
