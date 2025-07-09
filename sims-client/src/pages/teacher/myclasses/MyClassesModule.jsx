// src/pages/teacher/classes/MyClassesModule.jsx
import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Edit, Trash, X, Calendar, Clock, Book } from 'lucide-react'; // Import Lucide icons

const MyClassesModule = () => {
    // Mock current teacher ID.
    const currentTeacherId = "T125"; // Displaying classes for this teacher

    // Mock data for all classes in the system.
    const [allClasses, setAllClasses] = useState([
        {
            id: 'class_001',
            name: '9 A',
            subject: 'Chemistry',
            teacherId: 'T125',
            time: '09:00 AM - 10:00 AM',
            day: 'Monday, Wednesday, Friday',
            period: '1st Period'
        },
        {
            id: 'class_002',
            name: '10 B',
            subject: 'Physics',
            teacherId: 'T125',
            time: '10:00 AM - 11:00 AM',
            day: 'Monday, Tuesday, Wednesday, Thursday, Friday',
            period: '2nd Period'
        },
        {
            id: 'class_003',
            name: '8 C',
            subject: 'Biology',
            teacherId: 'T125',
            time: '11:00 AM - 12:00 PM',
            day: 'Tuesday, Thursday',
            period: '3rd Period'
        },
        {
            id: 'class_004',
            name: '7 D',
            subject: 'Chemistry',
            teacherId: 'T125',
            time: '12:00 PM - 01:00 PM',
            day: 'Monday, Wednesday',
            period: '4th Period'
        },
        {
            id: 'class_005',
            name: '6 E',
            subject: 'Physics',
            teacherId: 'T125',
            time: '01:00 PM - 02:00 PM',
            day: 'Wednesday, Friday',
            period: '5th Period'
        },
    ]);

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
        period: ''
    });

    // Filters classes to only show those assigned to the current teacher.
    const teacherClasses = useMemo(() => {
        return allClasses.filter(cls => cls.teacherId === currentTeacherId);
    }, [allClasses, currentTeacherId]);

    // Helper function to format the schedule string (e.g., "Mon-09:00AM")
    const formatSchedule = (dayString, timeString) => {
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
            period: ''
        });
        setShowForm(true);
    };

    // Populates form data with the class being edited and opens the form
    const handleEditClick = (cls) => {
        setEditingClass(cls);
        setFormData(cls); // Populate form with existing class data
        setShowForm(true);
    };

    // Handles deletion of a class
    const handleDeleteClick = (classId) => {
        // IMPORTANT: In a real application, replace window.confirm with a custom modal/dialog.
        if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            setAllClasses(prevClasses => prevClasses.filter(cls => cls.id !== classId));
            // If the deleted class was the one being edited, close the form
            if (editingClass && editingClass.id === classId) {
                handleCancelClick();
            }
        }
    };

    // Closes the form and resets editing state
    const handleCancelClick = () => {
        setShowForm(false);
        setEditingClass(null);
        setFormData({ // Reset form data
            id: '', name: '', subject: '', teacherId: currentTeacherId, time: '', day: '', period: ''
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
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        // IMPORTANT: In a real application, replace alert with a custom modal/dialog.
        if (!formData.name || !formData.subject || !formData.time || !formData.day || !formData.period) {
            alert('Please fill in all fields.');
            return;
        }

        if (editingClass) {
            // Update existing class
            setAllClasses(prevClasses =>
                prevClasses.map(cls =>
                    cls.id === editingClass.id ? { ...formData } : cls
                )
            );
        } else {
            // Add new class
            const newClass = { ...formData, id: `class_${Date.now()}` }; // Generate unique ID
            setAllClasses(prevClasses => [...prevClasses, newClass]);
        }

        setShowForm(false); // Close form after submission
        setEditingClass(null); // Clear editing state
        setFormData({ // Reset form data
            id: '', name: '', subject: '', teacherId: currentTeacherId, time: '', day: '', period: ''
        });
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
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Grade (e.g., 9 A)</label>
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
                            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">Period (e.g., 1st Period)</label>
                            <input
                                type="text"
                                name="period"
                                id="period"
                                value={formData.period}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Time (e.g., 09:00 AM - 10:00 AM)</label>
                            <input
                                type="text"
                                name="time"
                                id="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">Days (e.g., Monday, Wednesday, Friday)</label>
                            <input
                                type="text"
                                name="day"
                                id="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
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
                {teacherClasses.length === 0 ? (
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
                                    Grade
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Period
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teacherClasses.map(cls => (
                                <tr key={cls.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cls.subject}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.period}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" /> {cls.day}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock size={16} className="text-gray-400" /> {cls.time}
                                        </div>
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
                                                onClick={() => handleDeleteClick(cls.id)}
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
