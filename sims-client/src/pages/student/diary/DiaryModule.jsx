// src/pages/student/diary/DiaryModule.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { homeworkAPI } from '../../../services/api';

const DiaryModule = () => {
    // Mock Student ID - this should come from authentication context
    const currentStudentId = "student_S001"; 
    const [homeworkEntries, setHomeworkEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch homework data from backend
    useEffect(() => {
        const fetchHomework = async () => {
            try {
                setLoading(true);
                // This would need to be implemented in the backend to fetch homework for a specific student
                const response = await homeworkAPI.getAllHomework();
                setHomeworkEntries(response.data || []);
            } catch (error) {
                console.error('Error fetching homework:', error);
                setError('Failed to load homework data');
            } finally {
                setLoading(false);
            }
        };

        fetchHomework();
    }, []);

    // --- Mock data for student's enrolled classes/teachers ---
    // This simulates the relationship: which teachers' homework should this student see.
    // In a real system, this would be determined by the student's actual class enrollments.
    const [studentAssociatedTeacherIds] = useState(['teacher_T123', 'teacher_T125']); // Student S001 gets homework from T123 and T125

    // Filter homework entries to only show those from teachers associated with this student
    const filteredHomeworkEntries = useMemo(() => {
        return homeworkEntries.filter(entry => 
            studentAssociatedTeacherIds.includes(entry.teacherId)
        );
    }, [homeworkEntries, studentAssociatedTeacherIds]);

    // Group homework by date
    const homeworkByDate = useMemo(() => {
        const grouped = {};
        filteredHomeworkEntries.forEach(entry => {
            const dateKey = entry.date;
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(entry);
        });
        return grouped;
    }, [filteredHomeworkEntries]);

    // Get sorted dates
    const sortedDates = useMemo(() => {
        return Object.keys(homeworkByDate).sort((a, b) => new Date(b) - new Date(a));
    }, [homeworkByDate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading homework...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Homework Diary</h1>
                    
                    {sortedDates.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No homework assignments found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedDates.map(date => (
                                <div key={date} className="border border-gray-200 rounded-lg p-4">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                        {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        {homeworkByDate[date].map(entry => (
                                            <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        {entry.homeworkItems?.[0]?.subject || 'General'}
                                                    </h3>
                                                    <span className="text-sm text-gray-500">
                                                        Teacher: {entry.teacherId}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {entry.homeworkItems?.map((item, index) => (
                                                        <div key={index} className="pl-4 border-l-2 border-blue-200">
                                                            <p className="text-sm font-medium text-gray-600">
                                                                {item.subject}
                                                            </p>
                                                            <p className="text-gray-700">{item.homework}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiaryModule;