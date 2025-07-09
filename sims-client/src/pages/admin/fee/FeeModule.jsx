import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  Trash2,
  X // Changed from CircleX to X for standard close icon
} from 'lucide-react';
import { feeRecordsData } from './FeeData'; // Assuming FeeData.js exists and provides mock data

const FeeModule = () => {
  // State for fee records
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error handling

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    class: '',
    section: '',
    feeType: '1st Term',
    amount: '',
    paymentDate: '',
    paymentMethod: ''
  });

  // Filter state
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    feeType: '',
    paymentStatus: ''
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    totalFees: 0,
    paidFees: 0,
    termStats: {
      '1st Term': { total: 0, paid: 0 },
      '2nd Term': { total: 0, paid: 0 },
      '3rd Term': { total: 0, paid: 0 }
    }
  });

  // Fetch fee records from mock data
  useEffect(() => {
    // Simulate API call
    const fetchFeeRecords = () => {
      setLoading(true);
      setError(null);
      try {
        setTimeout(() => {
          setFeeRecords(feeRecordsData);
          calculateStats(feeRecordsData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch fee records.");
        setLoading(false);
      }
    };
    fetchFeeRecords();
  }, []);

  // Calculate statistics whenever feeRecords changes
  useEffect(() => {
    calculateStats(feeRecords);
  }, [feeRecords]);

  const calculateStats = (records) => {
    const total = records.reduce((sum, record) => sum + record.amount, 0);
    const paid = records
      .filter(record => record.status === 'Paid')
      .reduce((sum, record) => sum + record.amount, 0);

    // Calculate term-wise statistics
    const termStats = {
      '1st Term': { total: 0, paid: 0 },
      '2nd Term': { total: 0, paid: 0 },
      '3rd Term': { total: 0, paid: 0 }
    };

    records.forEach(record => {
      if (termStats[record.feeType]) { // Ensure feeType exists in termStats
        termStats[record.feeType].total += record.amount;
        if (record.status === 'Paid') {
          termStats[record.feeType].paid += record.amount;
        }
      }
    });

    setStats({
      totalFees: total,
      paidFees: paid,
      termStats
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    const { studentId, studentName, class: studentClass, section, amount } = formData;
    if (!studentId || !studentName || !studentClass || !section || !amount) {
      alert("Please fill in all required fields (Student ID, Student Name, Class, Section, Amount).");
      return false;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Amount must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (showAddModal) {
      // Add new fee record
      const newRecord = {
        ...formData,
        id: feeRecords.length > 0 ? Math.max(...feeRecords.map(r => r.id)) + 1 : 1,
        amount: Number(formData.amount),
        status: formData.paymentDate ? 'Paid' : 'Pending',
        dueDate: new Date().toISOString().slice(0, 10) // Adding a default due date for new records
      };
      setFeeRecords([...feeRecords, newRecord]);
      setShowAddModal(false);
      alert("Fee record added successfully!");
    } else {
      // Update existing record
      const updatedRecords = feeRecords.map(record =>
        record.id === currentRecord.id ? {
          ...formData,
          id: currentRecord.id,
          amount: Number(formData.amount),
          status: formData.paymentDate ? 'Paid' : 'Pending',
          dueDate: currentRecord.dueDate // Preserve existing due date
        } : record
      );
      setFeeRecords(updatedRecords);
      setShowEditModal(false);
      alert("Fee record updated successfully!");
    }

    // Reset form
    setFormData({
      studentId: '',
      studentName: '',
      class: '',
      section: '',
      feeType: '1st Term',
      amount: '',
      paymentDate: '',
      paymentMethod: ''
    });
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setFormData({
      ...record,
      paymentDate: record.paymentDate || '',
      paymentMethod: record.paymentMethod || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      setFeeRecords(feeRecords.filter(record => record.id !== id));
      alert("Fee record deleted successfully!");
    }
  };

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = searchTerm === '' ||
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (filters.class === '' || record.class === filters.class) &&
      (filters.section === '' || record.section === filters.section) &&
      (filters.feeType === '' || record.feeType === filters.feeType) &&
      (filters.paymentStatus === '' ||
        (filters.paymentStatus === 'Paid' && record.status === 'Paid') ||
        (filters.paymentStatus === 'Pending' && record.status === 'Pending'))
    );
  });

  // --- Export Functionality ---
  const handleExport = () => {
    const headers = ["Student ID", "Student Name", "Class", "Section", "Fee Type", "Amount", "Due Date", "Status", "Payment Date", "Payment Method"];
    const rows = filteredRecords.map(record => [
      record.studentId,
      record.studentName,
      record.class,
      record.section,
      record.feeType,
      record.amount,
      record.dueDate,
      record.status,
      record.paymentDate,
      record.paymentMethod
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(',')) // Enclose fields in quotes to handle commas within data
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'fee_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up
  };

  // --- Print Functionality ---
  const handlePrint = () => {
    const printContent = document.getElementById('fee-records-table').outerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Fee Records</title>
            <style>
              body { font-family: 'Arial', sans-serif; margin: 20px; }
              h1 { text-align: center; margin-bottom: 20px; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .status-paid { color: green; font-weight: bold; }
              .status-pending { color: orange; font-weight: bold; }
              /* Hide actions column for print */
              .no-print { display: none; }
            </style>
          </head>
          <body>
            <h1>Fee Records Report</h1>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert("Please allow pop-ups for printing functionality.");
    }
  };


  return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md"> {/* Added styling, adjusted padding and flex for mobile */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center mb-4 sm:mb-0"> {/* Adjusted font size and margin for mobile */}
            <IndianRupee className="mr-2 sm:mr-3 text-indigo-600" size={24} sm={32} /> Fee Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base" 
          >
            <Plus size={18} className="mr-2" /> Add New Fee
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6"> {/* Consistent styling, adjusted padding */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Filter size={18} className="mr-2 text-gray-600" /> Filter Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Responsive grid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                name="class"
                value={filters.class}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Classes</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <select
                name="feeType"
                value={filters.feeType}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Terms</option>
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-end"> 
            <button
              onClick={() => setFilters({
                class: '',
                section: '',
                feeType: '',
                paymentStatus: ''
              })}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-gray-300 transition duration-200" 
            >
              <Filter size={14} className="mr-1" /> Reset Filters
            </button>
          </div>
        </div>

        {/* Fee Records Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"> {/* Flex improvements */}
            <div className="relative w-full sm:w-64"> {/* Make search full width on mobile */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by ID or Name..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto"> {/* Stack buttons on mobile */}
              <button
                onClick={handleExport}
                className="flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 w-full sm:w-auto"
              >
                <Download size={16} className="mr-2" /> Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 w-full sm:w-auto"
              >
                <Printer size={16} className="mr-2" /> Print Report
              </button>
            </div>
          </div>

          {error && (
            <div className="p-8 text-center text-red-500 font-medium">
              Error: {error}
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
              Loading fee records...
            </div>
          ) : (
            <div className="overflow-x-auto" id="fee-records-table">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3"> {/* Adjusted padding and font size for mobile */}
                      Student ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                      Student Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                      Class/Section
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                      Fee Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                      Payment Date
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider no-print sm:px-6 sm:py-3"> {/* Added no-print */}
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm"> {/* Adjusted padding and font size for mobile */}
                          {record.studentId}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-800 sm:px-6 sm:py-4 sm:text-sm">
                          {record.studentName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                          {record.class}/{record.section}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                          {record.feeType}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                          ₹{record.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap sm:px-6 sm:py-4">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${record.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}> {/* Changed pending color */}
                            {record.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                          {record.paymentDate || 'N/A'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium no-print sm:px-6 sm:py-4 sm:text-sm"> {/* Added no-print */}
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2 p-0.5 sm:mr-3 sm:p-1 rounded-md hover:bg-gray-100 transition duration-150"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-900 p-0.5 sm:p-1 rounded-md hover:bg-gray-100 transition duration-150"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500 sm:text-md"> {/* Adjusted font size for mobile */}
                        No fee records found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Fee Modal */}
        {showAddModal && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-2xl transform transition-all duration-300 scale-100 mx-auto"> {/* Adjusted max-width for mobile */}
              <div className="p-4 sm:p-6"> {/* Adjusted padding */}
                <div className="flex justify-between items-center border-b pb-3 mb-3 sm:pb-4 sm:mb-4"> {/* Adjusted padding and margin */}
                  <h3 className="text-xl font-bold text-gray-900 flex items-center sm:text-2xl"> {/* Adjusted font size */}
                    <Plus size={20} className="inline mr-2 text-indigo-600 sm:mr-3" /> Add New Fee Record
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({
                        studentId: '',
                        studentName: '',
                        class: '',
                        section: '',
                        feeType: '1st Term',
                        amount: '',
                        paymentDate: '',
                        paymentMethod: ''
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700 transition duration-200"
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5"> {/* Adjusted spacing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        placeholder="e.g., S-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        placeholder="e.g., Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-red-500">*</span></label>
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Class</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section <span className="text-red-500">*</span></label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Section</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Term <span className="text-red-500">*</span></label>
                      <select
                        name="feeType"
                        value={formData.feeType}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="1st Term">1st Term</option>
                        <option value="2nd Term">2nd Term</option>
                        <option value="3rd Term">3rd Term</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                        placeholder="e.g., 5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                      <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Online">Online</option>
                        <option value="Card">Card</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t mt-6"> {/* Adjusted flex and spacing for mobile */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setFormData({
                          studentId: '',
                          studentName: '',
                          class: '',
                          section: '',
                          feeType: '1st Term',
                          amount: '',
                          paymentDate: '',
                          paymentMethod: ''
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200 shadow-md w-full sm:w-auto"
                    >
                      Save Fee Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Fee Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-2xl transform transition-all duration-300 scale-100 mx-auto"> {/* Adjusted max-width for mobile */}
              <div className="p-4 sm:p-6"> {/* Adjusted padding */}
                <div className="flex justify-between items-center border-b pb-3 mb-3 sm:pb-4 sm:mb-4"> {/* Adjusted padding and margin */}
                  <h3 className="text-xl font-bold text-gray-900 flex items-center sm:text-2xl"> {/* Adjusted font size */}
                    <Edit size={20} className="inline mr-2 text-indigo-600 sm:mr-3" /> Edit Fee Record
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setFormData({
                        studentId: '',
                        studentName: '',
                        class: '',
                        section: '',
                        feeType: '1st Term',
                        amount: '',
                        paymentDate: '',
                        paymentMethod: ''
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700 transition duration-200"
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:space-y-5"> {/* Adjusted spacing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-100 cursor-not-allowed"
                        required
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-red-500">*</span></label>
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section <span className="text-red-500">*</span></label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Term <span className="text-red-500">*</span></label>
                      <select
                        name="feeType"
                        value={formData.feeType}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="1st Term">1st Term</option>
                        <option value="2nd Term">2nd Term</option>
                        <option value="3rd Term">3rd Term</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                      <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Online">Online</option>
                        <option value="Card">Card</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t mt-6"> {/* Adjusted flex and spacing for mobile */}
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200 shadow-md w-full sm:w-auto"
                    >
                      Update Fee Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default FeeModule;