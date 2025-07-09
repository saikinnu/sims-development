import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Calendar as CalendarIcon, Ban, CalendarDays } from 'lucide-react';
import Calendar from './Calendar';

const AttendanceModule = () => {
    // Sample data - updated to include data from January 2025
    const [allAttendanceData] = useState([

        // April 2025 (provided by user)
        { date: '2025-04-01', status: 'present', checkIn: '08:00', checkOut: '15:00' },
        { date: '2025-04-02', status: 'present', checkIn: '08:05', checkOut: '15:10' },
        { date: '2025-04-03', status: 'half-day', checkIn: '08:30', checkOut: '12:00' },
        { date: '2025-04-04', status: 'present', checkIn: '08:10', checkOut: '15:15' },
        { date: '2025-04-05', status: 'absent', checkIn: null, checkOut: null, reason: 'Travel' },
        { date: '2025-04-08', status: 'late', checkIn: '09:35', checkOut: '15:25' },
        { date: '2025-04-10', status: 'present', checkIn: '08:15', checkOut: '15:30' },
        { date: '2025-04-11', status: 'holiday', checkIn: null, checkOut: null, reason: 'Eid-ul-Fitr' },

        // May 2025 (provided by user)
        { date: '2025-05-01', status: 'holiday', checkIn: null, checkOut: null, reason: 'Labour Day' },
        { date: '2025-05-02', status: 'present', checkIn: '08:00', checkOut: '15:00' },
        { date: '2025-05-03', status: 'present', checkIn: '08:05', checkOut: '15:10' },
        { date: '2025-05-06', status: 'absent', checkIn: null, checkOut: null, reason: 'Sick' },
        { date: '2025-05-07', status: 'present', checkIn: '08:10', checkOut: '15:15' },
        { date: '2025-05-08', status: 'late', checkIn: '09:20', checkOut: '15:00' },
        { date: '2025-05-09', status: 'half-day', checkIn: '08:30', checkOut: '12:00' },
        { date: '2025-05-13', status: 'present', checkIn: '08:15', checkOut: '15:20' },

        // June 2025 (provided by user, added entry for today)
        { date: '2025-06-03', status: 'present', checkIn: '08:00', checkOut: '15:00' },
        { date: '2025-06-04', status: 'present', checkIn: '08:05', checkOut: '15:10' },
        { date: '2025-06-05', status: 'absent', checkIn: null, checkOut: null, reason: 'Vacation' },
        { date: '2025-06-06', status: 'present', checkIn: '08:10', checkOut: '15:15' },
        { date: '2025-06-07', status: 'late', checkIn: '09:25', checkOut: '15:00' }, // Saturday, will not show icon
        { date: '2025-06-10', status: 'present', checkIn: '08:15', checkOut: '15:20' },
        { date: '2025-06-17', status: 'holiday', checkIn: null, checkOut: null, reason: 'Bakri Eid' },
        { date: '2025-06-20', status: 'half-day', checkIn: '08:30', checkOut: '12:00' },
        { date: '2025-06-21', status: 'present', checkIn: '08:20', checkOut: '15:30' }, // Saturday, will not show icon
        { date: '2025-06-23', status: 'present', checkIn: '08:00', checkOut: '15:00' }, // Added for current date (Monday)

    ]);

    // Initialize with the current date to show the current month by default
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0,
        halfDays: 0,
        holidays: 0
    });

    // Filter attendance data for the current month
    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth(); // 0-indexed month

        const filteredData = allAttendanceData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === year && itemDate.getMonth() === month;
        });
        setMonthlyAttendanceData(filteredData);
    }, [currentMonth, allAttendanceData]);

    // Calculate attendance stats for the monthlyAttendanceData
    useEffect(() => {
        const calculateStats = () => {
            const present = monthlyAttendanceData.filter(a => a.status === 'present').length;
            const absent = monthlyAttendanceData.filter(a => a.status === 'absent').length;
            const late = monthlyAttendanceData.filter(a => a.status === 'late').length;
            const halfDays = monthlyAttendanceData.filter(a => a.status === 'half-day').length;
            const holidays = monthlyAttendanceData.filter(a => a.status === 'holiday').length;

            setStats({
                present,
                absent,
                late,
                halfDays,
                holidays
            });
        };

        calculateStats();
    }, [monthlyAttendanceData]);

    // Helper function for coloring the status badge in details section
    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'half-day': return 'bg-blue-100 text-blue-800';
            case 'holiday': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CalendarDays size={32} className="text-indigo-600" />
          Attendance
        </h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="text-green-600 mb-1" size={24} />
                    <h3 className="text-sm font-medium text-gray-500">Present</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                    <XCircle className="text-red-600 mb-1" size={24} />
                    <h3 className="text-sm font-medium text-gray-500">Absent</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="text-yellow-600 mb-1" size={24} />
                    <h3 className="text-sm font-medium text-gray-500">Late Arrivals</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                    <Clock className="text-blue-600 mb-1" size={24} />
                    <h3 className="text-sm font-medium text-gray-500">Half Days</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.halfDays}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold mb-1">H</div>
                    <h3 className="text-sm font-medium text-gray-500">Holidays</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats.holidays}</p>
                </div>
            </div>

            {/* Calendar View Component */}
            <Calendar
                currentMonth={currentMonth}
                monthlyAttendanceData={monthlyAttendanceData}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setCurrentMonth={setCurrentMonth}
            />

            {/* Attendance Details */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Attendance Details</h2>
                    <p className="text-sm text-gray-500">
                        {selectedDate
                            ? `Details for ${selectedDate.date.toDateString()}`
                            : 'Select a date to view details'}
                    </p>
                </div>

                {selectedDate ? (
                    selectedDate.attendance ? (
                        <div className="p-4">
                            <div className={`flex items-center justify-between p-3 rounded-lg ${getStatusColor(selectedDate.attendance.status)} mb-4`}>
                                <div className="flex items-center">
                                    {/* Icons for the selected date detail */}
                                    {selectedDate.attendance.status === 'present' && <CheckCircle className="text-green-500" size={18} />}
                                    {selectedDate.attendance.status === 'absent' && <XCircle className="text-red-500" size={18} />}
                                    {selectedDate.attendance.status === 'late' && <AlertCircle className="text-yellow-500" size={18} />}
                                    {selectedDate.attendance.status === 'half-day' && <Clock className="text-blue-500" size={18} />}
                                    {selectedDate.attendance.status === 'holiday' && <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">H</div>}
                                    <span className="ml-2 font-medium capitalize">{selectedDate.attendance.status}</span>
                                </div>
                                {selectedDate.attendance.reason && (
                                    <span className="text-sm">{selectedDate.attendance.reason}</span>
                                )}
                            </div>

                            {(selectedDate.attendance.checkIn || selectedDate.attendance.checkOut) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Check In</h3>
                                        <div className="flex items-center">
                                            <Clock className="text-gray-400 mr-2" size={18} />
                                            <span className="text-lg font-medium">
                                                {selectedDate.attendance.checkIn || '--:--'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Check Out</h3>
                                        <div className="flex items-center">
                                            <Clock className="text-gray-400 mr-2" size={18} />
                                            <span className="text-lg font-medium">
                                                {selectedDate.attendance.checkOut || '--:--'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            {selectedDate.date.getDay() === 0 ? ( // Check if it's a Sunday
                                <>
                                    <Ban className="mx-auto mb-2 text-gray-400" size={24} />
                                    <p>No attendance recorded on Sundays</p>
                                </>
                            ) : (
                                <>
                                    <CalendarIcon className="mx-auto mb-2 text-gray-400" size={24} />
                                    <p>No attendance record for this date</p>
                                </>
                            )}
                        </div>
                    )
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        <CalendarIcon className="mx-auto mb-2 text-gray-400" size={24} />
                        <p>Select a date to view attendance details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceModule;