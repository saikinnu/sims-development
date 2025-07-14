import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Calendar as CalendarIcon, Ban, CalendarDays } from 'lucide-react';
import Calendar from './Calendar';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const AttendanceModule = () => {
    // Backend-driven attendance data
    const [allAttendanceData, setAllAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const token = JSON.parse(localStorage.getItem('authToken'));
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Helper to get student user_id from localStorage
    const getStudentUserId = () => {
        return JSON.parse(localStorage.getItem('authUserID'));
    };

    // Fetch student profile and attendance data
    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            setError('');
            try {
                const userId = getStudentUserId();
                if (!userId) throw new Error('Student user_id not found. Please log in again.');
                // Step 1: Get student profile to get MongoDB _id
                const profileRes = await axios.get(`${API_BASE}/students/by-userid/${userId}`, {
                    headers: getAuthHeaders(),
                });
                const student = profileRes.data;
                if (!student || !student._id) throw new Error('Student profile not found.');
                // Step 2: Fetch attendance records for this student
                const attendanceRes = await axios.get(`${API_BASE}/student-attendance/student/${student._id}`, {
                    headers: getAuthHeaders(),
                });
                // Normalize backend data to match frontend expectations
                const backendData = (attendanceRes.data || []).map(item => ({
                    date: item.date ? new Date(item.date).toISOString().slice(0, 10) : '',
                    status: item.status ? item.status.toLowerCase().replace(/ /g, '-') : '',
                    checkIn: item.checkIn || item.check_in || null,
                    checkOut: item.checkOut || item.check_out || null,
                    reason: item.remarks || item.reason || '',
                }));
                setAllAttendanceData(backendData);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load attendance data.');
            }
            setLoading(false);
        };
        fetchAttendance();
    }, []);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <h2 className="text-xl font-bold mb-2">Loading Attendance...</h2>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <XCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Attendance Data Not Found</h2>
                <p>{error}</p>
            </div>
        );
    }

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