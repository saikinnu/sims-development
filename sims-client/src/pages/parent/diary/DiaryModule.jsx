import React, { useState, useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { homeworkAPI } from '../../../services/api';
import { FaUsers, FaCheckCircle } from "react-icons/fa"; // Import FaUsers and FaCheckCircle for child selection UI
import { AlertCircle, BookOpen } from 'lucide-react'; // Added BookOpen for diary icon

const DiaryModule = () => {
    // Mock Parent and Children Data - this should come from authentication context
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

    // --- State for Home Work Diary (API data, now per child) ---
    const [allHomeworkEntriesByChild, setAllHomeworkEntriesByChild] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChild, setSelectedChild] = useState('child1'); // Default to first child

    // Fetch homework data from backend
    useEffect(() => {
        const fetchHomework = async () => {
            try {
                setLoading(true);
                // This would need to be implemented in the backend to fetch homework for specific students
                const response = await homeworkAPI.getAllHomework();
                const homeworkData = response.data || [];
                
                // Group homework by child (in a real app, this would be based on student IDs)
                const groupedByChild = {};
                parentInfo.children.forEach(child => {
                    groupedByChild[child.id] = homeworkData.filter(hw => 
                        hw.studentId === child.id || hw.class === child.grade
                    );
                });
                
                setAllHomeworkEntriesByChild(groupedByChild);
            } catch (error) {
                console.error('Error fetching homework:', error);
                setError('Failed to load homework data');
            } finally {
                setLoading(false);
            }
        };

        fetchHomework();
    }, [parentInfo.children]);

    // Get homework entries for the selected child
    const currentChildHomework = allHomeworkEntriesByChild[selectedChild] || [];

    // Group homework by date for the selected child
    const homeworkByDate = useMemo(() => {
        const grouped = {};
        currentChildHomework.forEach(entry => {
            const dateKey = entry.date;
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(entry);
        });
        return grouped;
    }, [currentChildHomework]);

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
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="text-blue-600" size={24} />
                        <h1 className="text-3xl font-bold text-gray-800">Homework Diary</h1>
                    </div>

                    {/* Child Selection */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <FaUsers className="text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-700">Select Child</h2>
                        </div>
                        <div className="flex gap-4">
                            {parentInfo.children.map(child => (
                                <div
                                    key={child.id}
                                    onClick={() => setSelectedChild(child.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedChild === child.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={child.profilePic}
                                        alt={child.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">{child.name}</p>
                                        <p className="text-sm text-gray-500">{child.grade}</p>
                                    </div>
                                    {selectedChild === child.id && (
                                        <FaCheckCircle className="text-blue-500 ml-auto" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Homework Content */}
                    {sortedDates.length === 0 ? (
                        <div className="text-center py-8">
                            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-500 text-lg">No homework assignments found for {parentInfo.children.find(c => c.id === selectedChild)?.name}.</p>
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
