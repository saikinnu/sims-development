// src/pages/admin/results/ResultsModule.jsx
import React, { useState, useMemo } from 'react';
import {
  Search, ChevronDown, ChevronUp, User, Book, Hash, Percent, Award,
  Filter, X, Star, Trophy, TrendingUp, AlertCircle, Download
} from 'lucide-react';
import {
  students as initialStudentsData,
  subjectsConfig,
  getStudentGradeCategory,
  allClasses,
  allSections
} from './ReportsData';

const ResultsModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterGradeCategory, setFilterGradeCategory] = useState(''); // New state for grade filter
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeFilters, setActiveFilters] = useState([]);

  // Define grade categories for the filter dropdown
  const gradeCategories = ['Excellent', 'Good', 'Average', 'Poor'];

  const studentsWithCalculatedResults = useMemo(() => {
    return initialStudentsData.map(student => {
      let totalMarksObtained = 0;
      let totalMaxMarks = 0;
      let subjectsAttempted = 0;

      Object.entries(student.marks).forEach(([subject, marks]) => {
        const subjectConf = subjectsConfig[subject];
        if (subjectConf) {
          totalMarksObtained += marks;
          totalMaxMarks += subjectConf.maxMarks;
          subjectsAttempted++;
        }
      });

      const overallPercentage = subjectsAttempted > 0
        ? (totalMarksObtained / totalMaxMarks) * 100
        : 0;
      const gradeCategory = getStudentGradeCategory(overallPercentage);

      return {
        ...student,
        totalMarksObtained,
        totalMaxMarks,
        overallPercentage: parseFloat(overallPercentage.toFixed(2)),
        gradeCategory
      };
    });
  }, [initialStudentsData, subjectsConfig]);

  const filteredStudents = useMemo(() => {
    let filtered = studentsWithCalculatedResults;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterClass) {
      filtered = filtered.filter(student => student.class === filterClass);
    }

    if (filterSection) {
      filtered = filtered.filter(student => student.section === filterSection);
    }

    // Apply grade category filter
    if (filterGradeCategory) {
      filtered = filtered.filter(student => student.gradeCategory === filterGradeCategory);
    }

    const filters = [];
    if (searchTerm) filters.push(`Search: "${searchTerm}"`);
    if (filterClass) filters.push(`Class: ${filterClass}`);
    if (filterSection) filters.push(`Section: ${filterSection}`);
    if (filterGradeCategory) filters.push(`Grade: ${filterGradeCategory}`); // Add to active filters
    setActiveFilters(filters);

    return filtered;
  }, [studentsWithCalculatedResults, searchTerm, filterClass, filterSection, filterGradeCategory]); // Add filterGradeCategory to dependencies

  const sortedStudents = useMemo(() => {
    if (!sortConfig.key) return filteredStudents;

    const sortableStudents = [...filteredStudents];
    sortableStudents.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (['overallPercentage', 'rollNo', 'totalMarksObtained'].includes(sortConfig.key)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortConfig.key === 'class') {
        const classNumA = parseInt(aValue.replace('Grade ', ''));
        const classNumB = parseInt(bValue.replace('Grade ', ''));
        if (classNumA < classNumB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (classNumA > classNumB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      } else if (sortConfig.key === 'gradeCategory') {
        const categoryOrder = { 'Excellent': 4, 'Good': 3, 'Average': 2, 'Poor': 1 };
        const orderA = categoryOrder[aValue] || 0;
        const orderB = categoryOrder[bValue] || 0;
        if (orderA < orderB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (orderA > orderB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sortableStudents;
  }, [filteredStudents, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline" /> : <ChevronDown size={14} className="ml-1 inline" />;
  };

  const allSubjects = useMemo(() => Object.keys(subjectsConfig), [subjectsConfig]);

  const getGradeCategoryColor = (category) => {
    switch (category) {
      case 'Excellent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Average':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getGradeCategoryIcon = (category) => {
    switch (category) {
      case 'Excellent':
        return <Trophy size={14} className="inline mr-1" />;
      case 'Good':
        return <Star size={14} className="inline mr-1" />;
      case 'Average':
        return <TrendingUp size={14} className="inline mr-1" />;
      case 'Poor':
        return <AlertCircle size={14} className="inline mr-1" />;
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterClass('');
    setFilterSection('');
    setFilterGradeCategory(''); // Reset new grade filter
  };

  const handleDownloadReport = () => {
    if (sortedStudents.length === 0) {
      alert("No data to download.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Student ID", "Name", "Class", "Section", "Roll No",
      ...allSubjects.map(sub => `${sub} Marks`),
      "Total Marks Obtained", "Total Max Marks", "Overall Percentage", "Grade Category"
    ];

    // Map student data to CSV rows
    const rows = sortedStudents.map(student => {
      const studentMarks = allSubjects.map(subject =>
        student.marks[subject] !== undefined ? student.marks[subject] : 'N/A'
      );
      return [
        `"${student.id}"`, // Enclose ID in quotes to prevent issues with leading zeros or large numbers
        `"${student.name.replace(/"/g, '""')}"`, // Handle commas/quotes in names
        `"${student.class}"`,
        `"${student.section}"`,
        student.rollNo,
        ...studentMarks,
        student.totalMarksObtained,
        student.totalMaxMarks,
        `${student.overallPercentage}%`,
        `"${student.gradeCategory}"`
      ].join(','); // Join cells with a comma
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','), // Join headers with a comma
      ...rows
    ].join('\n'); // Join rows with a newline character

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_report.csv'); // Set the filename
    document.body.appendChild(link); // Append to body to make it clickable
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Clean up the temporary element
    URL.revokeObjectURL(url); // Revoke the object URL to free up memory
  };


  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      <div className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Student Results Dashboard</h2>
              <p className="text-purple-100 text-sm mt-0.5">Performance overview</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-md px-3 py-1 flex items-center">
                <Award size={16} className="mr-1" />
                <span className="text-sm font-medium">{sortedStudents.length} Students</span>
              </div>
              <button
                onClick={handleDownloadReport}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md px-3 py-1 flex items-center text-sm font-medium transition-colors duration-200"
                title="Download Report as CSV"
              >
                <Download size={16} className="mr-1" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center">
              <Filter size={16} className="text-gray-500 dark:text-gray-400 mr-1" />
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">Filters</h3>
            </div>
            
            {activeFilters.length > 0 && (
              <button 
                onClick={clearFilters}
                className="text-xs flex items-center text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                <X size={14} className="mr-1" />
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-grow min-w-[150px]">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative min-w-[120px]">
              <select
                className="w-full pl-2 pr-6 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all appearance-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {allClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            <div className="relative min-w-[120px]">
              <select
                className="w-full pl-2 pr-6 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all appearance-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
              >
                <option value="">All Sections</option>
                {allSections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            {/* New Grade Category Filter */}
            <div className="relative min-w-[120px]">
              <select
                className="w-full pl-2 pr-6 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all appearance-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={filterGradeCategory}
                onChange={(e) => setFilterGradeCategory(e.target.value)}
              >
                <option value="">All Grades</option>
                {gradeCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Active filters chips */}
          {activeFilters.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {activeFilters.map((filter, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Table - Modified to be scrollable with a fixed height */}
        {/* Sets max-h to 450px for mobile (default) and reverts to 400px for small screens and up (desktop view). */}
        <div className="overflow-x-auto text-sm max-h-[450px] sm:max-h-[400px] overflow-y-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10"> {/* Make header sticky */}
                <tr>
                  <th 
                    className="w-48 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  
                  <th 
                    className="w-20 px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => requestSort('class')}
                  >
                    <div className="flex items-center">
                      <Book size={14} className="mr-0.5" />
                      <span>Class</span>
                      {getSortIcon('class')}
                    </div>
                  </th>
                  
                  <th 
                    className="w-16 px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => requestSort('section')}
                  >
                    <div className="flex items-center">
                      <Hash size={12} className="mr-0.5" />
                      <span>Sec</span>
                      {getSortIcon('section')}
                    </div>
                  </th>
                  
                  <th 
                    className="w-16 px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => requestSort('rollNo')}
                  >
                    <span>Roll No</span>
                    {getSortIcon('rollNo')}
                  </th>
                  
                  {allSubjects.map(subject => (
                    <th 
                      key={subject} 
                      className="w-20 px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium truncate">{subject.split(' ')[0]}</span>
                        <span className="text-[0.65rem] text-gray-400">/{subjectsConfig[subject].maxMarks}</span>
                      </div>
                    </th>
                  ))}
                  
                  <th className="w-20 px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <span>Total</span>
                  </th>
                  
                  <th 
                    className="w-20 px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => requestSort('overallPercentage')}
                  >
                    <div className="flex items-center justify-center">
                      <Percent size={12} className="mr-0.5" />
                      <span>%</span>
                      {getSortIcon('overallPercentage')}
                    </div>
                  </th>
                  
                  <th 
                    className="w-20 px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => requestSort('gradeCategory')}
                  >
                    <div className="flex items-center justify-center">
                      <Award size={12} className="mr-0.5" />
                      <span>Grade</span>
                      {getSortIcon('gradeCategory')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedStudents.length > 0 ? (
                  sortedStudents.map(student => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="w-48 px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <User size={14} className="text-purple-600 dark:text-purple-300" />
                          </div>
                          <div className="ml-2 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{student.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">ID: {student.id}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="w-20 px-2 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {student.class}
                      </td>
                      
                      <td className="w-16 px-2 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                          {student.section}
                        </span>
                      </td>
                      
                      <td className="w-16 px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.rollNo}
                      </td>
                      
                      {allSubjects.map(subject => (
                        <td key={`${student.id}-${subject}`} className="w-20 px-2 py-2 whitespace-nowrap">
                          <div className={`px-1 py-0.5 rounded text-center text-xs ${
                            student.marks[subject] >= subjectsConfig[subject].passingMarks ? 
                            'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                            'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {student.marks[subject] !== undefined ? student.marks[subject] : 'N/A'}
                          </div>
                        </td>
                      ))}
                      
                      <td className="w-20 px-2 py-2 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{student.totalMarksObtained}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            /{student.totalMaxMarks}
                          </span>
                        </div>
                      </td>
                      
                      <td className="w-20 px-2 py-2 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {student.overallPercentage}%
                          </span>
                        </div>
                      </td>
                      
                      <td className="w-20 px-2 py-2 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${getGradeCategoryColor(student.gradeCategory)}`}>
                          {getGradeCategoryIcon(student.gradeCategory)}
                          {student.gradeCategory}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5 + allSubjects.length} className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Search size={36} className="mb-3 text-gray-300 dark:text-gray-600" />
                        <h3 className="text-base font-medium mb-1">No results found</h3>
                        <p className="max-w-md text-sm">Try adjusting your search or filter criteria</p>
                        <button 
                          onClick={clearFilters}
                          className="mt-3 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with summary */}
        {sortedStudents.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/30 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Showing <span className="font-medium">{sortedStudents.length}</span> of <span className="font-medium">{initialStudentsData.length}</span> students
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center text-xs">
                  <span className="w-2 h-2 rounded-full bg-purple-600 mr-1"></span>
                  <span>Excellent: {sortedStudents.filter(s => s.gradeCategory === 'Excellent').length}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span>
                  <span>Good: {sortedStudents.filter(s => s.gradeCategory === 'Good').length}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                  <span>Average: {sortedStudents.filter(s => s.gradeCategory === 'Average').length}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                  <span>Poor: {sortedStudents.filter(s => s.gradeCategory === 'Poor').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsModule;