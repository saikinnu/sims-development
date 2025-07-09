// AdminFilterPanel.jsx
import React, { useState } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';

const AdminFilterPanel = ({ onApplyFilters, currentFilters, onClose }) => {
  const [empIdFilter, setEmpIdFilter] = useState(currentFilters.empId || '');
  const [subjectFilter, setSubjectFilter] = useState(currentFilters.subject || '');
  const [classFilter, setClassFilter] = useState(currentFilters.class || '');

  // Mock data for subjects and classes - replace with actual data if available
  const subjects = ['Mathematics', 'Science', 'History', 'English', 'Art'];
  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const handleApply = () => {
    onApplyFilters({
      empId: empIdFilter,
      subject: subjectFilter,
      class: classFilter,
    });
  };

  const handleClearAll = () => {
    setEmpIdFilter('');
    setSubjectFilter('');
    setClassFilter('');
    onApplyFilters({ empId: '', subject: '', class: '' });
  };

  return (
    <div className="absolute top-full mt-2 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter Admins</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* EMP ID Filter */}
        <div>
          <label htmlFor="filter-emp-id" className="block text-sm font-medium text-gray-700 mb-1">
            EMP ID
          </label>
          <div className="relative">
            <input
              type="text"
              id="filter-emp-id"
              placeholder="Filter by EMP ID"
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              value={empIdFilter}
              onChange={(e) => setEmpIdFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Subject Filter */}
        <div>
          <label htmlFor="filter-subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <div className="relative">
            <select
              id="filter-subject"
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none bg-white"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">Select subject...</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Class Filter */}
        <div>
          <label htmlFor="filter-class" className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <div className="relative">
            <select
              id="filter-class"
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none bg-white"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="">Select class...</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleClearAll}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium rounded-lg"
        >
          Clear all filters
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdminFilterPanel;