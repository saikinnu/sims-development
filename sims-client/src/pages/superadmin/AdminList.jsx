import React, { useState, useEffect } from 'react';
import { 
  Trash2, Edit, Save, X, Search, Filter, Download, 
  ChevronDown, ChevronUp, Calendar, AlertTriangle, User,
  Key, Eye, EyeOff 
} from 'lucide-react';
import { Switch } from '@headlessui/react';

const AdminList = ({ admins, setAdmins, calculateRenewalDate, isPlanExpired, formatDate }) => {
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'school_name', direction: 'asc' });
  const [editData, setEditData] = useState({
    school_name: '',
    email: '',
    user_id: '',
    password: '',
    confirmPassword: '',
    plan_type: 'monthly',
    renewal_date: '',
    shouldRenewPlan: false
  });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false);
  const [editError, setEditError] = useState('');

  // State for filter modal visibility
  const [showFilterModal, setShowFilterModal] = useState(false);
  // States for filter criteria
  const [filterCreatedFromDate, setFilterCreatedFromDate] = useState(''); // New state for 'Admins Created from' date
  const [filterPlanType, setFilterPlanType] = useState(''); // 'monthly', 'yearly', or ''
  const [filterStatus, setFilterStatus] = useState(''); // 'active', 'inactive', or ''

  // Effect to automatically set status to inactive if plan is expired,
  // UNLESS the user has manually overridden it to active.
  useEffect(() => {
    let changed = false;
    const updatedAdmins = admins.map(admin => {
      // If the plan is expired AND the admin is currently active
      // AND there's no manual override telling it to stay active,
      // then set to inactive.
      if (isPlanExpired(admin.renewal_date) && admin.status === true && admin.manualStatusOverride !== true) {
        changed = true;
        // When setting to inactive by system, reset manual override
        return { ...admin, status: false, manualStatusOverride: null }; 
      }
      return admin;
    });

    if (changed) {
      setAdmins(updatedAdmins);
    }
  }, [admins, isPlanExpired, setAdmins]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
    setEditError('');
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setEditData({
      school_name: admin.school_name,
      email: admin.email,
      user_id: admin.user_id,
      password: '',
      confirmPassword: '',
      plan_type: admin.plan_type,
      shouldRenewPlan: false // Default to false when opening edit
    });
    setShowEditPassword(false);
    setShowEditConfirmPassword(false);
    setEditError('');
  };

  const handleSaveEdit = (id) => {
    if (admins.some(admin => admin.id !== id && admin.user_id === editData.user_id)) {
      setEditError('User ID already exists for another admin.');
      return;
    }
    if (admins.some(admin => admin.id !== id && admin.email === editData.email)) {
      setEditError('Email ID already exists for another admin.');
      return;
    }

    if (editData.password || editData.confirmPassword) {
      if (editData.password !== editData.confirmPassword) {
        setEditError("New passwords don't match!");
        return;
      }
      if (editData.password.length < 8) {
        setEditError("Password must be at least 8 characters long.");
        return;
      }
    }

    setAdmins(prev =>
      prev.map(admin => {
        if (admin.id === id) {
          let newRenewalDate = admin.renewal_date;
          let newStatus = admin.status;
          let newManualOverride = admin.manualStatusOverride;

          if (editData.shouldRenewPlan) {
            newRenewalDate = calculateRenewalDate(editData.plan_type);
            newStatus = true; // Set to active on renewal
            newManualOverride = null; // Renewal implies system control, no manual override needed
          } else {
            // If not renewing, the status and override should generally be preserved.
            // The useEffect will handle system deactivation if the plan is expired
            // and no manual override is active.
          }

          return { 
            ...admin, 
            school_name: editData.school_name, 
            email: editData.email, 
            user_id: editData.user_id,
            plan_type: editData.plan_type,
            renewal_date: newRenewalDate,
            status: newStatus, // Keep current status unless renewed
            manualStatusOverride: newManualOverride
          };
        }
        return admin;
      })
    );
    setEditingId(null);
    setEditError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin account? This action cannot be undone.')) {
      setAdmins(prev => prev.filter(admin => admin.id !== id));
    }
  };

  // Handles manual status toggle, setting the manualStatusOverride flag
  const handleToggleStatus = (id) => {
    setAdmins(prevAdmins =>
      prevAdmins.map(admin => {
        if (admin.id === id) {
          const newStatus = !admin.status;
          let newManualOverride = null;

          if (newStatus === true) { // If user is trying to set status to ACTIVE
            if (isPlanExpired(admin.renewal_date)) {
              // If plan is expired but user wants it active, set manual override to true
              newManualOverride = true;
            } else {
              // If not expired and setting active, no special override needed, system can manage
              newManualOverride = null; 
            }
          } else { // If user is trying to set status to INACTIVE
            // If user explicitly sets to inactive, this is also a form of manual override
            newManualOverride = false;
          }
          
          return {
            ...admin,
            status: newStatus,
            manualStatusOverride: newManualOverride
          };
        }
        return admin;
      })
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Combine search and filter logic
  const filteredAndSortedAdmins = [...admins]
    .filter(admin =>
      // Search term filter
      (admin.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.user_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      // Admins Created from Date filter
      (filterCreatedFromDate === '' || new Date(admin.createdAt) >= new Date(filterCreatedFromDate)) &&
      // Plan Type filter from modal
      (filterPlanType === '' || admin.plan_type === filterPlanType) &&
      // Status filter from modal
      (filterStatus === '' || admin.status === (filterStatus === 'active'))
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Function to handle export to CSV
  const handleExport = () => {
    const headers = [
      "School Name", "Email ID", "User ID", "Plan Type", 
      "Created On", "Renewal Date", "Status", "Manual Override Status"
    ];
    
    // Format data for CSV
    const csvRows = filteredAndSortedAdmins.map(admin => { // Use filteredAndSortedAdmins for export
      const statusText = admin.status ? 'Active' : 'Inactive';
      const manualOverrideText = admin.manualStatusOverride === true ? 'Manual Active' : 
                                 admin.manualStatusOverride === false ? 'Manual Inactive' : 'System Controlled';
      
      return [
        `"${admin.school_name.replace(/"/g, '""')}"`, // Handle quotes in school name
        `"${admin.email.replace(/"/g, '""')}"`,
        `"${admin.user_id.replace(/"/g, '""')}"`,
        `"${admin.plan_type === 'monthly' ? 'Monthly' : 'Yearly'}"`,
        `"${formatDate(admin.createdAt)}"`,
        `"${formatDate(admin.renewal_date)}"`,
        `"${statusText}"`,
        `"${manualOverrideText}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'admin_accounts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up the URL object
  };

  const clearAllFilters = () => {
    setFilterCreatedFromDate(''); // Reset new filter
    setFilterPlanType('');
    setFilterStatus('');
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Registered Admin Accounts
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search admins..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilterModal(true)} // Open filter modal
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button 
            onClick={handleExport} // Added onClick handler for export
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {editError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {editError}
        </div>
      )}

      {filteredAndSortedAdmins.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User className="text-gray-400" size={40} />
          </div>
          <h3 className="lg font-medium text-gray-900">No admin accounts found</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm || filterCreatedFromDate || filterPlanType || filterStatus ? 'Try adjusting your search or filters' : 'Register a new admin using the form above'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('school_name')}
                >
                  <div className="flex items-center gap-1">
                    School Name
                    {sortConfig.key === 'school_name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email ID
                    {sortConfig.key === 'email' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('user_id')}
                >
                  <div className="flex items-center gap-1">
                    User ID
                    {sortConfig.key === 'user_id' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('plan_type')}
                >
                  <div className="flex items-center gap-1">
                    Plan Type
                    {sortConfig.key === 'plan_type' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Created On
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('renewal_date')}
                >
                  <div className="flex items-center gap-1">
                    Renewal Date
                    {sortConfig.key === 'renewal_date' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedAdmins.map((admin) => (
                <React.Fragment key={admin.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    {/* School Name Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === admin.id ? (
                        <input
                          type="text"
                          name="school_name"
                          value={editData.school_name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                          required
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{admin.school_name}</div>
                      )}
                    </td>
                    
                    {/* Email ID Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === admin.id ? (
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleEditChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                          required
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{admin.email}</div>
                      )}
                    </td>
                    
                    {/* User ID Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === admin.id ? (
                        <input
                          type="text"
                          name="user_id"
                          value={editData.user_id}
                          onChange={handleEditChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                          required
                        />
                      ) : (
                        <div className="text-sm text-gray-900 font-mono">{admin.user_id}</div>
                      )}
                    </td>
                    
                    {/* Plan Type Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === admin.id ? (
                        <select
                          name="plan_type"
                          value={editData.plan_type}
                          onChange={handleEditChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                          required
                        >
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {admin.plan_type === 'monthly' ? 'Monthly' : 'Yearly'}
                          {isPlanExpired(admin.renewal_date) && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Expired
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    {/* Created At Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {formatDate(admin.createdAt)}
                      </div>
                    </td>
                    
                    {/* Renewal Date Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm flex items-center ${
                        isPlanExpired(admin.renewal_date) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {formatDate(admin.renewal_date)}
                      </div>
                    </td>
                    
                    {/* Status Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Switch
                        checked={admin.status}
                        onChange={() => handleToggleStatus(admin.id)}
                        className={`${
                          admin.status ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">Toggle status</span>
                        <span
                          className={`${
                            admin.status ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform`}
                        />
                      </Switch>
                      <div className={`mt-1 text-xs font-medium ${admin.status ? 'text-green-600' : 'text-red-600'}`}>
                        {admin.status ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    
                    {/* Actions Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {editingId === admin.id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleSaveEdit(admin.id)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                            title="Save Changes"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditError(''); }}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
                            title="Cancel"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  
                  {/* Expanded Password Edit Row */}
                  {editingId === admin.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="px-6 py-4">
                        <div className="max-w-3xl mx-auto bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Update Password (Optional)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* New Password */}
                            <div>
                              <label htmlFor={`edit-password-${admin.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                                New Password
                              </label>
                              <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                  type={showEditPassword ? "text" : "password"}
                                  id={`edit-password-${admin.id}`}
                                  name="password"
                                  value={editData.password}
                                  onChange={handleEditChange}
                                  className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                  placeholder="Leave blank to keep current"
                                  minLength="8"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowEditPassword(!showEditPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                            
                            {/* Confirm Password */}
                            <div>
                              <label htmlFor={`edit-confirm-password-${admin.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                                Confirm Password
                              </label>
                              <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                  type={showEditConfirmPassword ? "text" : "password"}
                                  id={`edit-confirm-password-${admin.id}`}
                                  name="confirmPassword"
                                  value={editData.confirmPassword}
                                  onChange={handleEditChange}
                                  className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                  placeholder="Confirm new password"
                                  minLength="8"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showEditConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Renew Plan Option within Edit */}
                          {isPlanExpired(admin.renewal_date) && ( // Only show if plan is expired
                            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center">
                                <AlertTriangle className="text-blue-600 mr-2 h-4 w-4" />
                                <p className="text-sm text-blue-800">
                                  This plan is expired. Renew to extend for one {editData.plan_type === 'monthly' ? 'month' : 'year'}.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditData(prev => ({ ...prev, shouldRenewPlan: !prev.shouldRenewPlan }))}
                                className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200 ${
                                  editData.shouldRenewPlan
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {editData.shouldRenewPlan ? 'Renewal Selected' : 'Renew Plan'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowFilterModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Filter Admin Accounts</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Admins Created from - Date Filter (New) */}
              <div>
                <label htmlFor="filter-createdFrom" className="block text-sm font-medium text-gray-700 mb-1">
                  Admins Created from
                </label>
                <input
                  type="date"
                  id="filter-createdFrom"
                  value={filterCreatedFromDate}
                  onChange={(e) => setFilterCreatedFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Plan Type Filter */}
              <div>
                <label htmlFor="filter-planType" className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Type
                </label>
                <select
                  id="filter-planType"
                  value={filterPlanType}
                  onChange={(e) => setFilterPlanType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none bg-white"
                >
                  <option value="">Select plan type...</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="filter-status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none bg-white"
                >
                  <option value="">Select status...</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear all filters
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply Filters (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminList;