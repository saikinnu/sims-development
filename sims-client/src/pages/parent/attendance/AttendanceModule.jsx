import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, AlertCircle, Clock, Calendar as CalendarIcon, Ban, CalendarDays } from 'lucide-react';
import { FaUsers, FaCheckCircle } from "react-icons/fa";
import Calendar from './Calendar';
import { attendanceAPI, parentAPI } from '../../../services/api';

const AttendanceModule = () => {
    const [parentInfo, setParentInfo] = useState({ children: [] });
    const [selectedChildId, setSelectedChildId] = useState(null);
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch parent profile and children data
    useEffect(() => {
        const fetchParentData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get parent profile with linked students
                const response = await parentAPI.getMyProfile();
                const { parent, linkedStudents } = response.data;
                
                console.log('Parent data:', parent);
                console.log('Linked students:', linkedStudents);
                
                // Transform students data to match the expected format
                const children = linkedStudents.map(student => ({
                    id: student._id,
                    name: student.full_name,
                    grade: student.class_id ? student.class_id.class_name : 'N/A',
                    rollNumber: student.admission_number,
                    profilePic: student.profile_image?.url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
                }));

                console.log('Transformed children data:', children);
                setParentInfo({ children });
                
                // Set first child as selected if available
                if (children.length > 0) {
                    setSelectedChildId(children[0].id);
                }
            } catch (err) {
                console.error('Error fetching parent data:', err);
                setError('Failed to load children data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, []);

    // Fetch attendance data for selected child and current month
    useEffect(() => {
        const fetchAttendanceData = async () => {
            if (!selectedChildId) {
                setMonthlyAttendanceData([]);
                return;
            }

            try {
                setLoading(true);
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth() + 1; // 1-indexed month for API

                // Get monthly attendance report for the selected student
                const response = await attendanceAPI.getMonthlyReport(selectedChildId, month, year);
                const { records } = response.data;

                console.log('Raw attendance data:', records);

                // Transform data to match the expected format
                const transformedData = records.map(item => ({
                    date: new Date(item.date).toISOString().split('T')[0],
                    status: item.status.toLowerCase(),
                    reason: item.remarks || null
                }));

                console.log('Transformed attendance data:', transformedData);
                setMonthlyAttendanceData(transformedData);
                setSelectedDate(null); // Clear selected date when child or month changes
            } catch (err) {
                console.error('Error fetching attendance data:', err);
                setError('Failed to load attendance data. Please try again.');
                setMonthlyAttendanceData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [currentMonth, selectedChildId]);

    // Calculate attendance stats for the monthlyAttendanceData
    useEffect(() => {
        const calculateStats = () => {
            const present = monthlyAttendanceData.filter(a => a.status === 'present').length;
            const absent = monthlyAttendanceData.filter(a => a.status === 'absent').length;
            const late = monthlyAttendanceData.filter(a => a.status === 'late').length;
            // Note: Backend doesn't have half-day or holiday status, so these will always be 0
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

    // Handle child selection
    const handleChildSelect = (childId) => {
        setSelectedChildId(childId);
        setCurrentMonth(new Date()); // Reset calendar to current month for new child
    };

    // Get the currently selected child object
    const selectedChild = parentInfo.children.find(child => child.id === selectedChildId);

    if (loading && parentInfo.children.length === 0) {
        return (
            <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                <div className="bg-red-50 p-4 rounded-lg text-red-800 flex items-center justify-center mb-6 shadow-sm">
                    <AlertCircle className="mr-2" size={20} />
                    {error}
                </div>
            </div>
        );
    }

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CalendarDays size={32} className="text-indigo-600" />
          Attendance Records
        </h1>
            </div>

            {/* Children Selector */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parentInfo.children.map(child => (
                        <div
                            key={child.id}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                                ${selectedChildId === child.id ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => handleChildSelect(child.id)}
                        >
                            <img
                                src={child.profilePic}
                                alt={child.name}
                                className="rounded-full mr-3 border border-gray-200"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow">
                                <h6 className="mb-0 font-semibold text-gray-800">{child.name}</h6>
                                <small className="text-gray-500">{child.grade} {child.rollNumber && `• Roll No: ${child.rollNumber}`}</small>
                            </div>
                            {selectedChildId === child.id && (
                                <FaCheckCircle className="text-blue-500 ml-auto" size={20} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Display message if no child is selected or no children exist */}
            {!selectedChildId && (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-center justify-center mb-6 shadow-sm">
                    <AlertCircle className="mr-2" size={20} />
                    Please select a child to view attendance records.
                </div>
            )}

            {selectedChildId && (
                <>
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

                                    {selectedDate.attendance.reason && (
                                        <div className="border rounded-lg p-4 mt-4">
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Remarks</h3>
                                            <div className="flex items-center">
                                                <span className="text-lg font-medium">
                                                    {selectedDate.attendance.reason}
                                                </span>
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
                </>
            )}
        </div>
    );
};

export default AttendanceModule;
