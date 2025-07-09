// src/pages/student/diary/DiaryModule.jsx
import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';

const DiaryModule = () => {
    // Mock Student ID
    const currentStudentId = "student_S001"; 
    const [homeworkEntries, setHomeworkEntries] = useState([
        {
            id: 'hw1',
            teacherId: 'teacher_T123', // Assigned by teacher T123
            date: '2025-06-27',
            homeworkItems: [
                { subject: 'Mathematics', homework: 'Complete exercises on Quadratic Equations (pg 45-47).' },
                { subject: 'Science', homework: 'Draw and label the parts of a plant cell and research photosynthesis.' }
            ]
        },
        {
            id: 'hw4',
            teacherId: 'teacher_T125', // Assigned by teacher T125
            date: '2025-06-28', // Future date
            homeworkItems: [
                { subject: 'Physics', homework: 'Solve problems on Newton\'s Laws (Chapter 3).' },
                { subject: 'Computer Science', homework: 'Complete coding assignment 2 on arrays.' }
            ]
        },
    ]);

    // --- Mock data for student's enrolled classes/teachers ---
    // This simulates the relationship: which teachers' homework should this student see.
    // In a real system, this would be determined by the student's actual class enrollments.
    const [studentAssociatedTeacherIds] = useState(['teacher_T123', 'teacher_T125']); // Student S001 gets homework from T123 and T125

    // Filter and sort homework entries for display based on the student's associated teachers
    const displayedHomeworkEntries = useMemo(() => {
        return homeworkEntries
            .filter(entry => studentAssociatedTeacherIds.includes(entry.teacherId)) // Only show homework from assigned teachers
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()); // Sort by date descending
    }, [homeworkEntries, studentAssociatedTeacherIds]);

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Homework Diary</h1>
            </div>

            {/* No tabs needed as only Homework Diary is shown */}

            {/* Content Area for Home Work Diary */}
            <div className="space-y-4">
                {displayedHomeworkEntries.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No homework assignments found from your teachers.</div>
                ) : (
                    <div className="space-y-4">
                        {displayedHomeworkEntries.map(entry => (
                            <div key={entry.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500">{format(parseISO(entry.date), 'MMM dd, yyyy')}</p>
                                        {/* You might want to display the teacher's name here, if available */}
                                        {/* <p className="text-xs text-gray-400">Assigned by: [Teacher Name based on {entry.teacherId}]</p> */}
                                    </div>
                                    {/* No edit/delete buttons for students */}
                                </div>
                                <div className="space-y-2 text-sm text-gray-700 mt-2">
                                    {entry.homeworkItems.map((item, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <p><span className="font-semibold">{item.subject}:</span> {item.homework}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default DiaryModule;