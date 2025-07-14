import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { CreateEditHomeworkModal, CreateEditPersonalDiaryModal } from './AddDiary'; 

axios.defaults.baseURL = 'http://localhost:5000';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = JSON.parse(localStorage.getItem('authToken'));
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const DiaryModule = () => {
    const tabs = ["Home Work Diary", "Personal Diary"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const [currentTeacherId, setCurrentTeacherId] = useState(null);
    const [loadingTeacherId, setLoadingTeacherId] = useState(true);

    // --- State for Home Work Diary ---
    const [homeworkEntries, setHomeworkEntries] = useState([]);
    const [showHomeworkModal, setShowHomeworkModal] = useState(false);
    const [editingHomework, setEditingHomework] = useState(null);
    const [loadingHomework, setLoadingHomework] = useState(false);

    // --- State for Personal Diary ---
    const [personalNotes, setPersonalNotes] = useState([]);
    const [showPersonalDiaryModal, setShowPersonalDiaryModal] = useState(false);
    const [editingPersonalNote, setEditingPersonalNote] = useState(null);
    const [loadingPersonal, setLoadingPersonal] = useState(false);

    const subjectOptions = [
        'Math', 'Science', 'English', 'History', 'Geography', 'Biology',
        'Chemistry', 'Physics', 'Computer Science', 'Art', 'Music', 'Drama',
    ];

    // --- Fetch Teacher Profile ---
    const fetchTeacherProfile = async () => {
        try {
            const res = await axios.get('/api/teachers/profile', { headers: getAuthHeaders() });
            setCurrentTeacherId(res.data._id);
        } catch (err) {
            console.error('Failed to fetch teacher profile:', err);
        } finally {
            setLoadingTeacherId(false);
        }
    };

    // --- Fetch Data on Mount ---
    useEffect(() => {
        fetchTeacherProfile();
    }, []);

    // --- Fetch Data when Teacher ID is available ---
    useEffect(() => {
        if (currentTeacherId) {
            fetchHomeworkEntries();
            fetchPersonalNotes();
        }
    }, [currentTeacherId]);

    const fetchHomeworkEntries = async () => {
        setLoadingHomework(true);
        try {
            const res = await axios.get(`/api/diary/homework`, { params: { teacherId: currentTeacherId }, headers: getAuthHeaders() });
            setHomeworkEntries(res.data || []);
        } catch (err) {
            console.error('Failed to fetch homework entries:', err);
        } finally {
            setLoadingHomework(false);
        }
    };

    const fetchPersonalNotes = async () => {
        setLoadingPersonal(true);
        try {
            const res = await axios.get(`/api/diary/personal`, { params: { teacherId: currentTeacherId }, headers: getAuthHeaders() });
            setPersonalNotes(res.data || []);
        } catch (err) {
            console.error('Failed to fetch personal notes:', err);
        } finally {
            setLoadingPersonal(false);
        }
    };

    // --- Home Work Diary Handlers ---
    const handleAddEditHomework = (entry = null) => {
        setEditingHomework(entry);
        setShowHomeworkModal(true);
    };

    const handleSaveHomework = async (data) => {
        if (editingHomework) {
            // Edit
            try {
                const res = await axios.put(`/api/diary/homework/${editingHomework._id}`, data, { headers: getAuthHeaders() });
                setHomeworkEntries(prev => prev.map(e => (e._id === editingHomework._id ? res.data : e)));
                console.log("Homework updated:", res.data);
            } catch (err) {
                console.error('Failed to update homework:', err);
            }
        } else {
            // Add
            try {
                const res = await axios.post(`/api/diary/homework`, { ...data, teacherId: currentTeacherId }, { headers: getAuthHeaders() });
                setHomeworkEntries(prev => [...prev, res.data]);
                console.log("Homework added:", res.data);
            } catch (err) {
                console.error('Failed to add homework:', err);
            }
        }
        setShowHomeworkModal(false);
        setEditingHomework(null);
    };

    const handleDeleteHomework = async (id) => {
        if (window.confirm("Are you sure you want to delete this homework entry?")) {
            try {
                await axios.delete(`/api/diary/homework/${id}`, { headers: getAuthHeaders() });
                setHomeworkEntries(prev => prev.filter(e => e._id !== id));
                console.log("Homework deleted:", id);
            } catch (err) {
                console.error('Failed to delete homework:', err);
            }
        }
    };

    const filteredHomeworkEntries = useMemo(() => {
        return homeworkEntries
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }, [homeworkEntries]);

    // --- Personal Diary Handlers ---
    const handleAddEditPersonalNote = (note = null) => {
        setEditingPersonalNote(note);
        setShowPersonalDiaryModal(true);
    };

    const handleSavePersonalNote = async (data) => {
        if (editingPersonalNote) {
            // Edit
            try {
                const res = await axios.put(`/api/diary/personal/${editingPersonalNote._id}`, data, { headers: getAuthHeaders() });
                setPersonalNotes(prev => prev.map(n => (n._id === editingPersonalNote._id ? res.data : n)));
                console.log("Personal note updated:", res.data);
            } catch (err) {
                console.error('Failed to update personal note:', err);
            }
        } else {
            // Add
            try {
                const res = await axios.post(`/api/diary/personal`, { ...data, teacherId: currentTeacherId }, { headers: getAuthHeaders() });
                setPersonalNotes(prev => [...prev, res.data]);
                console.log("Personal note added:", res.data);
            } catch (err) {
                console.error('Failed to add personal note:', err);
            }
        }
        setShowPersonalDiaryModal(false);
        setEditingPersonalNote(null);
    };

    const handleDeletePersonalNote = async (id) => {
        if (window.confirm("Are you sure you want to delete this personal note?")) {
            try {
                await axios.delete(`/api/diary/personal/${id}`, { headers: getAuthHeaders() });
                setPersonalNotes(prev => prev.filter(n => n._id !== id));
                console.log("Personal note deleted:", id);
            } catch (err) {
                console.error('Failed to delete personal note:', err);
            }
        }
    };

    const filteredPersonalNotes = useMemo(() => {
        return personalNotes
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }, [personalNotes]);

    // Show loading state while fetching teacher ID
    if (loadingTeacherId) {
        return (
            <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                <div className="text-center text-gray-500 py-10">Loading teacher profile...</div>
            </div>
        );
    }

    // Show error state if teacher ID couldn't be fetched
    if (!currentTeacherId) {
        return (
            <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                <div className="text-center text-red-500 py-10">Failed to load teacher profile. Please try again.</div>
            </div>
        );
    }

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Diary</h1>
                {activeTab === "Home Work Diary" && (
                    <button
                        onClick={() => handleAddEditHomework(null)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FiPlus className="mr-2 text-xl" />
                        Add Homework
                    </button>
                )}
                {activeTab === "Personal Diary" && (
                    <button
                        onClick={() => handleAddEditPersonalNote(null)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FiPlus className="mr-2 text-xl" />
                        Add Personal Note
                    </button>
                )}
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
                {activeTab === "Home Work Diary" && (
                    <>
                        {loadingHomework ? (
                            <div className="text-center text-gray-500 py-10">Loading homework assignments...</div>
                        ) : filteredHomeworkEntries.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No homework assignments found. Click "Add Homework" to add one!</div>
                        ) : (
                            <div className="space-y-4">
                                {filteredHomeworkEntries.map(entry => (
                                    <div key={entry._id} className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500">{format(parseISO(entry.date), 'MMM dd, yyyy')}</p>
                                            </div>
                                            <div className="flex-shrink-0 flex space-x-2">
                                                <button
                                                    onClick={() => handleAddEditHomework(entry)}
                                                    className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                                >
                                                    <FiEdit className="mr-1" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHomework(entry._id)}
                                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                                >
                                                    <FiTrash2 className="mr-1" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-700 mt-2">
                                            {entry.homeworkItems && entry.homeworkItems.map((item, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <p><span className="font-semibold">{item.subject}:</span> {item.homework}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === "Personal Diary" && (
                    <>
                        {loadingPersonal ? (
                            <div className="text-center text-gray-500 py-10">Loading personal notes...</div>
                        ) : filteredPersonalNotes.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No personal notes found. Click "Add Personal Note" to add one!</div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPersonalNotes.map(note => (
                                    <div key={note._id} className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                                            <p className="text-xs text-gray-500">{format(parseISO(note.date), 'MMM dd, yyyy')}</p>
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">{note.title}</h3>
                                            <p className="text-gray-700 text-sm break-words">{note.content}</p>
                                        </div>
                                        <div className="flex-shrink-0 flex space-x-2">
                                            <button
                                                onClick={() => handleAddEditPersonalNote(note)}
                                                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                            >
                                                <FiEdit className="mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeletePersonalNote(note._id)}
                                                className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                            >
                                                <FiTrash2 className="mr-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

            {/* Modals */}
            {showHomeworkModal && (
                <CreateEditHomeworkModal
                    initialData={editingHomework}
                    onClose={() => { setShowHomeworkModal(false); setEditingHomework(null); }}
                    onSave={handleSaveHomework}
                    subjectOptions={subjectOptions}
                />
            )}

            {showPersonalDiaryModal && (
                <CreateEditPersonalDiaryModal
                    initialData={editingPersonalNote}
                    onClose={() => { setShowPersonalDiaryModal(false); setEditingPersonalNote(null); }}
                    onSave={handleSavePersonalNote}
                />
            )}
        </div>
    );
};

export default DiaryModule;