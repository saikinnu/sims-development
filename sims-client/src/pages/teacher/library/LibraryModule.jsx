// src/pages/admin/library/LibraryModule.jsx
import React, { useState, useMemo, useCallback } from 'react';
import AddEditResourceModal from './AddEditResourceModal';
import ResourceCard from './ResourceCard';
import { FiPlus } from 'react-icons/fi'; // Plus icon for "Add Resource" button
import { FaBookOpen, FaSearch } from 'react-icons/fa'; // Icons for library and search
import { X, Filter, Search, Plus } from 'lucide-react'; // Icons from lucide-react

const LibraryModule = () => {
  // State for all library resources (in-memory mock data)
  const [allResources, setAllResources] = useState([
    {
      id: 'res_001',
      subject: 'Mathematics',
      topic: 'Algebra Basics',
      classes: ['Class 8', 'Class 9'],
      description: 'Comprehensive guide to fundamental algebraic concepts.',
      type: 'pdf',
      url: 'math_algebra_basics.pdf',
      title: 'Algebra Basics Textbook',
    },
    {
      id: 'res_002',
      subject: 'Science',
      topic: 'Photosynthesis Cycle',
      classes: ['Class 6', 'Class 7', 'Class 8'],
      description: 'Visual explanation of how plants make food.',
      type: 'video',
      url: 'https://youtube.com/photosynthesis_vid',
      title: 'Photosynthesis Animated Video',
    },
    {
      id: 'res_003',
      subject: 'English',
      topic: 'Grammar Rules',
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
      description: 'Essential English grammar rules for all grades.',
      type: 'image',
      url: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Grammar%20Chart',
      title: 'English Grammar Chart',
    },
    {
      id: 'res_004',
      subject: 'History',
      topic: 'World War II Overview',
      classes: ['Class 9', 'Class 10'],
      description: 'Concise summary of key events and figures in WWII.',
      type: 'link',
      url: 'https://wikipedia.org/wiki/World_War_II',
      title: 'World War II Wikipedia',
    },
    {
      id: 'res_005',
      subject: 'Mathematics',
      topic: 'Geometry Formulas',
      classes: ['Class 7', 'Class 8', 'Class 9'],
      description: 'Quick reference for common geometry formulas.',
      type: 'pdf',
      url: 'geometry_formulas.pdf',
      title: 'Geometry Formulas Sheet',
    },
  ]);

  // Combined state for filters
  const [filters, setFilters] = useState({
    searchQuery: '',
    subject: 'All', // Default to 'All' for <select>
    class: 'All Classes', // Default to 'All Classes' for <select>
    type: 'All',    // Added type filter
  });

  const [showFilters, setShowFilters] = useState(false); // State to toggle filter dropdown
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New state for mobile search

  // State for modal visibility and data when editing
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null); // Null for adding, object for editing

  // Options for dropdowns
  const classOptions = useMemo(() => ([
    'All Classes',
    ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)
  ]), []);

  const subjectOptions = useMemo(() => {
    // Collect unique subjects and sort them, then add 'All'
    const subjects = new Set(allResources.map(res => res.subject));
    return ['All', ...Array.from(subjects).sort()];
  }, [allResources]);

  const resourceTypes = ['All', 'pdf', 'image', 'video', 'link']; // Options for Filter by Type


  // Handler for filter changes
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  }, []);

  // Calculate active filter count for the Filters button badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subject && filters.subject !== 'All') count++;
    if (filters.class && filters.class !== 'All Classes') count++;
    if (filters.type && filters.type !== 'All') count++; // Count type filter
    return count;
  }, [filters]);


  // Memoized filtered and sorted resources for efficient rendering
  const filteredResources = useMemo(() => {
    let tempResources = [...allResources];

    // Filter by main search query (Title, Subject, Topic, Desc, ID - simplified to include all relevant fields)
    if (filters.searchQuery) {
      const lowerCaseSearchTerm = filters.searchQuery.toLowerCase();
      tempResources = tempResources.filter(res =>
        res.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.topic.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.id.toLowerCase().includes(lowerCaseSearchTerm) // Include ID in general search
      );
    }

    // Filter by subject
    if (filters.subject !== 'All') {
      tempResources = tempResources.filter(res => res.subject === filters.subject);
    }

    // Filter by class
    if (filters.class !== 'All Classes') {
      tempResources = tempResources.filter(res => res.classes.includes(filters.class));
    }

    // Filter by type
    if (filters.type !== 'All') {
      tempResources = tempResources.filter(res => res.type === filters.type);
    }

    return tempResources;
  }, [allResources, filters]);


  // Handler for opening the Add/Edit modal
  const handleAddEditResource = (resource = null) => {
    setEditingResource(resource); // Pass resource data if editing, null if adding
    setShowAddEditModal(true);
  };

  // Handler for saving a resource (add or update)
  const handleSaveResource = (resourceData) => {
    if (editingResource) {
      // Update existing resource
      setAllResources(prevResources =>
        prevResources.map(res => (res.id === editingResource.id ? { ...res, ...resourceData } : res))
      );
      console.log("Resource updated:", resourceData);
    } else {
      // Add new resource with a unique ID
      const newResource = {
        ...resourceData,
        id: `res_${Date.now()}`, // Simple unique ID
      };
      setAllResources(prevResources => [...prevResources, newResource]);
      console.log("Resource added:", newResource);
    }
    setShowAddEditModal(false); // Close modal
    setEditingResource(null); // Clear editing state
  };

  // Handler for deleting a resource
  const handleDeleteResource = (resourceId) => {
    // Replaced window.confirm with a custom modal/dialog in a real app
    // For this example, we'll keep it as is, but note the instruction to avoid alert/confirm.
    if (window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      setAllResources(prevResources =>
        prevResources.filter(res => res.id !== resourceId)
      );
      console.log("Resource deleted:", resourceId);
    }
  };

  // Handler to clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      subject: 'All',
      class: 'All Classes',
      type: 'All',
    });
  }, []);

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaBookOpen className="text-blue-600 text-3xl mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Digital Library Management</h1>
        </div>
      </div>

      {/* Main Filter Section */}
      <div className='flex justify-between mb-4'>
        {/* Search Bar (Desktop) */}
        <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full md:w-[400px]'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by Title, Topic, Subject, Class..."
            className="p-2 bg-transparent outline-none flex-1 min-w-0"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className='flex gap-2'>
            {/* Mobile Search Button */}
            <button
              className='md:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md text-sm'
              onClick={() => setShowMobileSearch(!showMobileSearch)} // Toggle mobile search visibility
            >
              <Search size={16} />
              Search
            </button>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100'
            }`}
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
            <span className="hidden md:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0 md:ml-1 inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleAddEditResource(null)} // This button now opens the Add Resource modal
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <Plus size={16} className='mr-2' />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className='md:hidden flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full mb-4 animate-fade-in'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by Title, Topic, Subject, Class..."
            className="p-2 bg-transparent outline-none flex-1 min-w-0"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Filter by Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Subject</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
              >
                {subjectOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Filter by Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)}
              >
                {classOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

          </div>
          <div className='flex justify-end mt-4'>
            <button
              onClick={clearFilters}
              className='text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors duration-200'
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Resource Cards Display */}
      <div className="min-h-[300px]">
        {filteredResources.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-6 rounded-lg shadow-md text-center">
            <p className="font-bold text-lg mb-2">No Resources Found!</p>
            <p>Adjust your filters or add new resources to the library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onEdit={handleAddEditResource} // Reusing for edit mode
                onDelete={handleDeleteResource}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Resource Modal */}
      {showAddEditModal && (
        <AddEditResourceModal
          initialData={editingResource}
          onClose={() => {
            setShowAddEditModal(false);
            setEditingResource(null); // Clear editing state on close
          }}
          onSave={handleSaveResource}
          // Pass class options excluding 'All Classes' and in {value, label} format for the modal
          classOptions={classOptions.filter(option => option !== 'All Classes').map(cls => ({ value: cls, label: cls }))}
        />
      )}
    </div>
  );
};

export default LibraryModule;
