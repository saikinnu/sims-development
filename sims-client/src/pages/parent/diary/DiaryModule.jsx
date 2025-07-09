import React, { useState, useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { FaUsers, FaCheckCircle } from "react-icons/fa"; // Import FaUsers and FaCheckCircle for child selection UI
import { AlertCircle, BookOpen } from 'lucide-react'; // Added BookOpen for diary icon

const DiaryModule = () => {
    // Mock Parent and Children Data
    const [parentInfo] = useState({
        children: [
            {
                id: 'child1',
                name: "Alex Johnson",
                grade: "Grade 5",
                rollNo: '2025001',
                profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            },
            {
                id: 'child2',
                name: "Emily Johnson",
                grade: "Grade 4",
                rollNo: '2025002',
                profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            }
        ]
    });

    // --- State for Home Work Diary (mock data, now per child) ---
    const [allHomeworkEntriesByChild, setAllHomeworkEntriesByChild] = useState({
        'child1': [
            {
                id: 'hw1_child1',
                teacherId: 'teacher_T123',
                date: '2025-06-27',
                homeworkItems: [
                    { subject: 'Mathematics', homework: 'Complete exercises on Quadratic Equations (pg 45-47).' },
                    { subject: 'Science', homework: 'Draw and label the parts of a plant cell and research photosynthesis.' }
                ]
            },
            {
                id: 'hw2_child1',
                teacherId: 'teacher_T124',
                date: '2025-06-26',
                homeworkItems: [
                    { subject: 'English', homework: 'Read Chapter 5 of "The Great Gatsby" and write a summary.' }
                ]
            },
            {
                id: 'hw3_child1',
                teacherId: 'teacher_T123',
                date: '2025-06-25',
                homeworkItems: [
                    { subject: 'Mathematics', homework: 'Review fractions for upcoming test.' }
                ]
            },
            {
                id: 'hw4_child1',
                teacherId: 'teacher_T125',
                date: '2025-06-28', // Future date
                homeworkItems: [
                    { subject: 'Physics', homework: 'Solve problems on Newton\'s Laws (Chapter 3).' },
                    { subject: 'Computer Science', homework: 'Complete coding assignment 2 on arrays.' }
                ]
            },
        ],
        'child2': [
            {
                id: 'hw1_child2',
                teacherId: 'teacher_T126',
                date: '2025-06-27',
                homeworkItems: [
                    { subject: 'Art', homework: 'Sketch a landscape using watercolors.' }
                ]
            },
            {
                id: 'hw2_child2',
                teacherId: 'teacher_T127',
                date: '2025-06-25',
                homeworkItems: [
                    { subject: 'History', homework: 'Research ancient civilizations and prepare a short presentation.' }
                ]
            },
            {
                id: 'hw3_child2',
                teacherId: 'teacher_T126',
                date: '2025-06-28', // Future date
                homeworkItems: [
                    { subject: 'Music', homework: 'Practice scales for 15 minutes.' }
                ]
            },
        ]
    });

    const [selectedChildId, setSelectedChildId] = useState(null);

    // Set initial selected child when component mounts
    useEffect(() => {
        if (parentInfo.children && parentInfo.children.length > 0) {
            setSelectedChildId(parentInfo.children[0].id);
        }
    }, [parentInfo.children]);

    // Filter and sort homework entries for display based on selected child
    const displayedHomeworkEntries = useMemo(() => {
        if (!selectedChildId) {
            return [];
        }
        const homeworkForSelectedChild = allHomeworkEntriesByChild[selectedChildId] || [];
        // Sort by date descending
        return homeworkForSelectedChild.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }, [selectedChildId, allHomeworkEntriesByChild]);

    // Handle child selection
    const handleChildSelect = (childId) => {
        setSelectedChildId(childId);
    };

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-0 text-center sm:text-left">
                        <BookOpen size={36} className="text-blue-600" />
                        Homework Diary
                    </h1>

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
                                    <h6 className="mb-0 font-semibold text-gray-800 text-base">{child.name}</h6>
                                    <small className="text-gray-500 text-xs sm:text-sm">
                                        {child.grade} {child.rollNo && `• Roll No: ${child.rollNo}`}
                                    </small>
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
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-center justify-center mb-6 shadow-sm text-sm sm:text-base">
                        <AlertCircle className="mr-2" size={20} />
                        Please select a child to view their homework diary.
                    </div>
                )}

                {selectedChildId && (
                    <div>
                        {displayedHomeworkEntries.length === 0 ? (
                            <div className="text-center text-gray-500 py-10 text-base sm:text-lg">No homework assignments found for this child.</div>
                        ) : (
                            <div className="space-y-4">
                                {displayedHomeworkEntries.map(entry => (
                                    <div key={entry.id} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 sm:text-sm">{format(parseISO(entry.date), 'MMM dd, yyyy')}</p>
                                                {/* Optionally display teacher's ID or name if available */}
                                                {/* <p className="text-xs text-gray-400">Assigned by: {entry.teacherId}</p> */}
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-700 mt-2">
                                            {entry.homeworkItems.map((item, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-md border border-gray-100 shadow-sm text-sm sm:text-base">
                                                    <p><span className="font-semibold">{item.subject}:</span> {item.homework}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
    );
};

export default DiaryModule;
