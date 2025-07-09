import React, { useState } from 'react';
import AddParent from './AddParent';
import ParentDetails from './ParentDetails';
import { Edit, Trash, Plus, Filter, X, Search } from 'lucide-react'; 
import Select from 'react-select'; 

function ParentModule() {
  const [parents, setParents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filters, setFilters] = useState({
    parentId: '',
    childrenCount: null, // Filter for children count
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New state for mobile search

  const childrenCountOptions = [
    { value: 1, label: '1 Child' },
    { value: 2, label: '2 Children' },
    { value: 3, label: '3 Children' },
    { value: 4, label: '4 Children' },
    { value: 5, label: '5+ Children' },
  ];

  const handleAddParent = (data) => {
    setParents([...parents, data]);
  };

  const handleView = (parent) => {
    setSelectedParent(parent);
    setIsEditMode(false);
    setShowDetailsModal(true);
  };

  const handleEdit = (parent) => {
    setSelectedParent(parent);
    setIsEditMode(true);
    setShowDetailsModal(true);
  };

  const handleUpdate = (updated) => {
    setParents(parents.map((p) => (p.parentId === updated.parentId ? updated : p)));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this parent record?')) {
        setParents(parents.filter((p) => p.parentId !== id));
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      parentId: '',
      childrenCount: null,
      searchQuery: ''
    });
  };

  const activeFilterCount = Object.values(filters).filter(f => f && (typeof f !== 'object' || (f && f.value))).length;

  const filteredParents = parents.filter(parent => {
    if (filters.parentId && !parent.parentId.toLowerCase().includes(filters.parentId.toLowerCase())) return false;
    
    // ChildrenCount filter logic
    if (filters.childrenCount) {
        if (filters.childrenCount.value === 5) { // Assuming '5+' includes 5 and more
            if (parent.childrenCount < 5) return false;
        } else if (parent.childrenCount !== filters.childrenCount.value) {
            return false;
        }
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchFields = [
        parent.parentId.toLowerCase(),
        parent.name.toLowerCase(),
        parent.email.toLowerCase(),
        parent.phone.toLowerCase(),
        parent.address.toLowerCase(),
        String(parent.childrenCount).toLowerCase(), // Include childrenCount in search
      ];
      return searchFields.some(field => field.includes(query));
    }

    return true;
  });

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className='flex justify-between mb-4'>
          {/* Search Bar - Desktop */}
          <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full md:w-[400px]'>
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by ID, Name, Email, Phone, Address, Children Count..."
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
              onClick={() => setShowAddModal(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              <Plus size={16} className='mr-2' />
              <span>Add Parent</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {showMobileSearch && (
          <div className='md:hidden flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full mb-4 animate-fade-in'>
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by ID, Name, Email, Phone, Address, Children Count..."
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent ID</label>
                <input
                  type="text"
                  placeholder="Filter by Parent ID"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={filters.parentId}
                  onChange={(e) => handleFilterChange('parentId', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Children Count</label>
                <Select
                  options={childrenCountOptions}
                  value={filters.childrenCount}
                  onChange={(selected) => handleFilterChange('childrenCount', selected)}
                  placeholder="Select count..."
                  isClearable
                  className="basic-select"
                  classNamePrefix="select"
                />
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

        {/* Table */}
        <div className="bg-white border border-gray-200 shadow overflow-hidden sm:rounded-lg">
          {/* Using 'table-fixed' to ensure columns respect explicit widths and 'overflow-x-auto' for responsiveness */}
          <div className="overflow-x-auto"> 
            <table className="min-w-full divide-y divide-gray-200 table-fixed"> {/* Added table-fixed */}
              <thead className="bg-gray-50">
                <tr>
                  {/* Set approximate widths to help the table layout, allowing content to wrap */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Parent ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Children Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Address
                  </th>
                  <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]"> {/* Adjusted for actions icons */}
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParents.length > 0 ? (
                  filteredParents.map((parent) => (
                    <tr key={parent.parentId} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900 break-words'> {/* Removed whitespace-nowrap, added break-words */}
                        {parent.parentId}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900 break-words'> {/* Removed whitespace-nowrap, added break-words */}
                        <div className='flex items-center gap-2'>
                          {parent.image && <img src={parent.image} alt='Parent Avatar' className='w-8 h-8 rounded-full object-cover' />}
                          {parent.name}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500 break-words'> {/* Removed whitespace-nowrap, added break-words */}
                        {parent.email}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500 break-words'> {/* Removed whitespace-nowrap, added break-words */}
                        {parent.phone}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500 break-words'> {/* Removed whitespace-nowrap, added break-words */}
                        {parent.childrenCount}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500 break-words'> {/* Removed whitespace-nowrap, added break-words */}
                        {parent.address}
                      </td>
                      <td className='px-6 py-4 text-right text-sm font-medium'>
                        <div className="flex items-center justify-end gap-2">
                          <span
                            onClick={() => handleView(parent)}
                            className='text-blue-600 cursor-pointer hover:text-blue-800 text-lg'
                            title="View"
                          >
                            👁️
                          </span>
                          <button
                            onClick={() => handleEdit(parent)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(parent.parentId)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search size={40} className='mb-3 text-gray-400' />
                        <h3 className='text-lg font-semibold mb-1'>
                          {parents.length === 0 ? 'No parents yet!' : 'No matching parents found.'}
                        </h3>
                        <p className='mt-1 text-sm text-gray-600'>
                          {parents.length === 0 ? 'Get started by adding a new parent record' :
                            'Try adjusting your search or filter criteria'}
                        </p>
                        {parents.length === 0 && (
                          <button
                            onClick={() => setShowAddModal(true)}
                            className='mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                          >
                            <Plus size={20} className='mr-2' />
                            Add Parent
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddParent
            onClose={() => setShowAddModal(false)}
            onSave={handleAddParent}
            existingParents={parents}
          />
        )}

        {showDetailsModal && (
          <ParentDetails
            onClose={() => setShowDetailsModal(false)}
            data={selectedParent}
            editable={isEditMode}
            onUpdate={handleUpdate}
            existingParents={parents}
          />
        )}
      </div>
  );
}

export default ParentModule;