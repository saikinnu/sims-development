// src/pages/teacher/classes/MyClassesModule.jsx
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Edit, Trash, X, Calendar, Clock, Book } from 'lucide-react'; // Import Lucide icons

const API_BASE_URL = 'http://localhost:5000/api/classes';

const MyClassesModule = () => {
    // Mock current teacher ID (empId).
    const currentTeacherId = "T125"; // Displaying classes for this teacher
    const currentTeacherName = "Current Teacher"; // Optionally, get from auth context

    // State for all classes fetched from backend
    const [allClasses, setAllClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for managing the add/edit form
    const [showForm, setShowForm] = useState(false);
    const [editingClass, setEditingClass] = useState(null); // Holds the class object being edited
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        subject: '',
        teacherId: currentTeacherId, // Default to current teacher
        time: '',
        day: '',
        period: '',
        strength: '',
        grade: '',
        supervisor: ''
    });

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const token = JSON.parse(localStorage.getItem('authToken'));
        return {
            Authorization: token ? `Bearer ${token}` : '',
            'X-App-Client': 'teacher-portal', // Example custom header
        };
    };

    // Fetch all classes from backend on mount
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(API_BASE_URL, {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                });
                setAllClasses(res.data);
            } catch (err) {
                setError('Failed to fetch classes.');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Filters classes to only show those assigned to the current teacher (by empId)
    const teacherClasses = useMemo(() => {
        return allClasses.filter(cls =>
            Array.isArray(cls.teachers_details) &&
            cls.teachers_details.some(t => t.empId === currentTeacherId)
        );
    }, [allClasses, currentTeacherId]);

    // Helper function to format the schedule string (e.g., "Mon-09:00AM")
    const formatSchedule = (dayString, timeString) => {
        if (!dayString || !timeString) return '';
        const firstDayAbbr = dayString.split(',')[0].substring(0, 3);
        const startTime = timeString.split(' - ')[0];
        return `${firstDayAbbr} @ ${startTime}`;
    };

    // Resets form data and opens the form for adding a new class
    const handleAddClick = () => {
        setEditingClass(null); // Not editing any existing class
        setFormData({
            id: '', // Will be generated on submission
            name: '',
            subject: '',
            teacherId: currentTeacherId,
            time: '',
            day: '',
            period: '',
            strength: '',
            grade: '',
            supervisor: ''
        });
        setShowForm(true);
    };

    // Populates form data with the class being edited and opens the form
    const handleEditClick = (cls) => {
        setEditingClass(cls);
        // Map backend class to form fields
        setFormData({
            id: cls._id,
            name: cls.class_name || '',
            subject: (cls.teachers_details && cls.teachers_details[0]?.subjects[0]) || '',
            teacherId: (cls.teachers_details && cls.teachers_details[0]?.empId) || currentTeacherId,
            time: cls.time || '',
            day: cls.day || '',
            period: cls.period || '',
            strength: cls.strength || '',
            grade: cls.grade || '',
            supervisor: cls.supervisor || ''
        });
        setShowForm(true);
    };

    // Handles deletion of a class
    const handleDeleteClick = async (classId) => {
        if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            setLoading(true);
            setError(null);
            try {
                await axios.delete(`${API_BASE_URL}/${classId}`, {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                });
                setAllClasses(prevClasses => prevClasses.filter(cls => cls._id !== classId));
                if (editingClass && editingClass._id === classId) {
                    handleCancelClick();
                }
            } catch (err) {
                setError('Failed to delete class.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Closes the form and resets editing state
    const handleCancelClick = () => {
        setShowForm(false);
        setEditingClass(null);
        setFormData({
            id: '', name: '', subject: '', teacherId: currentTeacherId, time: '', day: '', period: '', strength: '', grade: '', supervisor: ''
        });
    };

    // Handles changes in form input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handles form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.subject || !formData.strength) {
            alert('Please fill in all required fields (Class Name, Subject, Strength).');
            return;
        }
        setLoading(true);
        setError(null);
        // Prepare backend payload
        const payload = {
            class_name: formData.name,
            strength: Number(formData.strength),
            grade: formData.grade,
            supervisor: formData.supervisor,
            teachers_details: [
                {
                    name: currentTeacherName,
                    empId: currentTeacherId,
                    subjects: [formData.subject]
                }
            ],
            // Optionally, you can add time/day/period as custom fields if backend supports
        };
        try {
            if (editingClass) {
                // Update existing class
                const res = await axios.put(`${API_BASE_URL}/${formData.id}`, payload, {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                });
                setAllClasses(prevClasses =>
                    prevClasses.map(cls =>
                        cls._id === formData.id ? res.data : cls
                    )
                );
            } else {
                // Add new class
                const res = await axios.post(API_BASE_URL, payload, {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                });
                setAllClasses(prevClasses => [...prevClasses, res.data]);
            }
            setShowForm(false);
            setEditingClass(null);
            setFormData({ id: '', name: '', subject: '', teacherId: currentTeacherId, time: '', day: '', period: '', strength: '', grade: '', supervisor: '' });
        } catch (err) {
            setError('Failed to save class.');
        } finally {
            setLoading(false);
        }
    };


    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b-2 border-blue-500">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <BookOpen size={36} className="text-blue-600" /> My Assigned Classes
                </h1>
                <button
                    onClick={handleAddClick}
                    className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md flex items-center gap-2"
                >
                    <Plus size={20} /> Add New Class
                </button>
            </div>

            {/* Loading/Error State */}
            {loading && (
                <div className="text-center text-blue-600 py-8">Loading classes...</div>
            )}
            {error && (
                <div className="text-center text-red-600 py-4">{error}</div>
            )}

            {/* Add/Edit Class Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                        {editingClass ? 'Edit Class Details' : 'Add New Class'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Class Name (e.g., 9 A)</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-2">Strength</label>
                            <input
                                type="number"
                                name="strength"
                                id="strength"
                                value={formData.strength}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                            <input
                                type="text"
                                name="grade"
                                id="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                            />
                        </div>
                        <div>
                            <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
                            <input
                                type="text"
                                name="supervisor"
                                id="supervisor"
                                value={formData.supervisor}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                            />
                        </div>
                        {/* Optionally, add time/day/period fields if you want to store them as custom fields */}
                        <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="px-6 py-3 border border-gray-300 rounded-full shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
                            >
                                {editingClass ? 'Update Class' : 'Add Class'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Main Content Area: Table of Classes */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 min-h-[400px] overflow-x-auto border border-gray-200">
                {(!loading && teacherClasses.length === 0) ? (
                    // Display message if no classes are assigned
                    <div className="text-center text-gray-500 py-16 flex flex-col items-center justify-center">
                        <Book size={60} className="mb-6 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Classes Assigned Yet!</h3>
                        <p className="text-base text-gray-600 mb-6">
                            It looks like you haven't been assigned any classes.
                            <br />
                            Please add a class using the "Add New Class" button above to get started.
                        </p>
                        <button
                            onClick={handleAddClick}
                            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md flex items-center gap-2"
                        >
                            <Plus size={20} /> Add Your First Class
                        </button>
                    </div>
                ) : (
                    // Display classes in a table
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject Name
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Class Name
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Strength
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Grade
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Supervisor
                                </th>
                                <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teacherClasses.map(cls => (
                                <tr key={cls._id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {(cls.teachers_details && cls.teachers_details[0]?.subjects[0]) || ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.class_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.strength}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.grade}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.supervisor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEditClick(cls)}
                                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                                title="Edit Class"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(cls._id)}
                                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                                title="Delete Class"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyClassesModule;
