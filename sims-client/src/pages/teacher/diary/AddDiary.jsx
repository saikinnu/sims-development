import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import Select from 'react-select'; // For better dropdowns
import axios from 'axios';

// Component for adding/editing Homework Diary entry
export const CreateEditHomeworkModal = ({ initialData, onClose, onSave, subjectOptions }) => {
    const [formData, setFormData] = useState({
        date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
        homeworkItems: initialData?.homeworkItems && initialData.homeworkItems.length > 0
            ? initialData.homeworkItems
            : [{ subject: '', homework: '' }],
    });

    const today = format(new Date(), 'yyyy-MM-dd');

    const handleHomeworkItemChange = (index, field, value) => {
        const newHomeworkItems = [...formData.homeworkItems];
        newHomeworkItems[index] = { ...newHomeworkItems[index], [field]: value };
        setFormData(prev => ({ ...prev, homeworkItems: newHomeworkItems }));
    };

    const addHomeworkItem = () => {
        setFormData(prev => ({
            ...prev,
            homeworkItems: [...prev.homeworkItems, { subject: '', homework: '' }]
        }));
    };

    const removeHomeworkItem = (index) => {
        const newHomeworkItems = formData.homeworkItems.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, homeworkItems: newHomeworkItems.length > 0 ? newHomeworkItems : [{ subject: '', homework: '' }] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasEmptyItems = formData.homeworkItems.some(item => !item.subject || !item.homework);
        if (hasEmptyItems) {
            alert("Please fill in all subject and homework details, or remove empty homework items.");
            return;
        }
        onSave(formData);
    };

    const filteredSubjectOptions = subjectOptions.map(sub => ({ value: sub, label: sub }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center border-b p-4 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {initialData ? 'Edit Homework Assignment' : 'Add New Homework Assignment'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                min={today}
                                required
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Homework Details per Subject</h3>
                        {formData.homeworkItems.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <Select
                                        options={filteredSubjectOptions}
                                        value={filteredSubjectOptions.find(opt => opt.value === item.subject)}
                                        onChange={(selected) => handleHomeworkItemChange(index, 'subject', selected ? selected.value : '')}
                                        placeholder="Select subject..."
                                        className="basic-single"
                                        classNamePrefix="select"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Homework Details</label>
                                    <textarea
                                        value={item.homework}
                                        onChange={(e) => handleHomeworkItemChange(index, 'homework', e.target.value)}
                                        placeholder="e.g., Read pages 10-15 and answer questions 1-5."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>
                                {formData.homeworkItems.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeHomeworkItem(index)}
                                        className="flex-shrink-0 self-end sm:self-start bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1.5 rounded-md text-sm font-medium transition duration-200"
                                        title="Remove this homework item"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addHomeworkItem}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center shadow-sm transition duration-300 ease-in-out mt-2"
                        >
                            <FiPlus className="mr-2 text-xl" />
                            Add Another Subject's Homework
                        </button>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            {initialData ? 'Update HomeWork' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Component for adding/editing Personal Diary entry
export const CreateEditPersonalDiaryModal = ({ initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
        title: initialData?.title || '',
        content: initialData?.content || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const today = format(new Date(), 'yyyy-MM-dd');

    return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center border-b p-4 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {initialData ? 'Edit Personal Note' : 'Add New Personal Note'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min={today}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Meeting notes, To-do list"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Write your personal notes here..."
                            rows="8"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            {initialData ? 'Update Note' : 'Add Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};