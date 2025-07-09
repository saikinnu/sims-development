import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Banknote,
  Building,
  QrCode,
  Save,
  XCircle,
  Info,
  BadgeInfo,
  UploadCloud,
  CheckCircle, // Added for success messages or indicators
  X, // For dismissible alerts
} from 'lucide-react';

const BankModule = () => {
  // State to store all bank details
  const [banks, setBanks] = useState([]);
  // State for the form inputs
  const [currentBank, setCurrentBank] = useState({
    id: null,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    qrCodeBase64: null, // Stores Base64 string of the QR code image
    qrFileName: '' // To display the original file name
  });
  // State for QR code image preview
  const [qrPreview, setQrPreview] = useState(null);
  // State to manage form visibility (for adding/editing)
  const [showForm, setShowForm] = useState(false);
  // State for alert messages
  const [alert, setAlert] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  const MAX_BANKS = 5;

  // Load banks from localStorage on component mount
  useEffect(() => {
    const storedBanks = localStorage.getItem('banks');
    if (storedBanks) {
      setBanks(JSON.parse(storedBanks));
    }
  }, []);

  // Save banks to localStorage whenever the banks state changes
  useEffect(() => {
    localStorage.setItem('banks', JSON.stringify(banks));
  }, [banks]);

  // Handle input changes for the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBank(prev => ({ ...prev, [name]: value }));
  };

  // Handle QR code file input
  const handleQrCodeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) { // Limit to 500KB for localStorage
        setAlert({ message: 'File size exceeds 500KB. Please choose a smaller image.', type: 'error' });
        e.target.value = null; // Clear the input
        setQrPreview(null);
        setCurrentBank(prev => ({ ...prev, qrCodeBase64: null, qrFileName: '' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result);
        setCurrentBank(prev => ({
          ...prev,
          qrCodeBase64: reader.result,
          qrFileName: file.name
        }));
        setAlert({ message: 'QR Code image uploaded successfully!', type: 'success' });
      };
      reader.readAsDataURL(file);
    } else {
      setQrPreview(null);
      setCurrentBank(prev => ({ ...prev, qrCodeBase64: null, qrFileName: '' }));
      setAlert({ message: 'QR Code image cleared.', type: 'info' });
    }
  };

  // Add a new bank or update an existing one
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentBank.bankName || !currentBank.accountNumber || !currentBank.ifscCode) {
      setAlert({ message: 'Bank Name, Account Number, and IFSC Code are required.', type: 'error' });
      return;
    }

    if (currentBank.id) {
      // Update existing bank
      setBanks(banks.map(bank =>
        bank.id === currentBank.id ? currentBank : bank
      ));
      setAlert({ message: 'Bank details updated successfully!', type: 'success' });
    } else {
      // Add new bank
      if (banks.length >= MAX_BANKS) {
        setAlert({ message: `You can add a maximum of ${MAX_BANKS} banks.`, type: 'error' });
        return;
      }
      setBanks([...banks, { ...currentBank, id: Date.now().toString() }]);
      setAlert({ message: 'New bank added successfully!', type: 'success' });
    }
    resetForm();
  };

  // Edit bank
  const handleEdit = (bank) => {
    setCurrentBank(bank);
    setQrPreview(bank.qrCodeBase64); // Set preview if QR exists
    setShowForm(true);
    setAlert({ message: '', type: '' }); // Clear any previous alerts
  };

  // Delete bank
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      setBanks(banks.filter(bank => bank.id !== id));
      // If the deleted bank was being edited, reset the form
      if (currentBank.id === id) {
        resetForm();
      }
      setAlert({ message: 'Bank record deleted successfully!', type: 'success' });
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setCurrentBank({
      id: null,
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      qrCodeBase64: null,
      qrFileName: ''
    });
    setQrPreview(null);
    setShowForm(false);
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <Banknote className="mr-4 text-indigo-600" size={36} />
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">Manage Bank Details</h1>
        </div>

        {/* Alert Message */}
        {alert.message && (
          <div className={`flex items-center justify-between p-4 mb-6 rounded-lg shadow-md ${
            alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            alert.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`} role="alert">
            <div className="flex items-center">
              {alert.type === 'success' && <CheckCircle className="mr-3" size={20} />}
              {alert.type === 'error' && <XCircle className="mr-3" size={20} />}
              {alert.type === 'info' && <Info className="mr-3" size={20} />}
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ message: '', type: '' })}
              className={`p-1 rounded-full transition-colors ${
                alert.type === 'success' ? 'hover:bg-green-200' :
                alert.type === 'error' ? 'hover:bg-red-200' :
                'hover:bg-blue-200'
              }`}
              aria-label="Dismiss alert"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Add New Bank Button */}
        <div className="mb-6">
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setAlert({ message: '', type: '' }); }}
              disabled={banks.length >= MAX_BANKS}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="mr-2" size={22} />
              Add New Bank ({banks.length}/{MAX_BANKS})
            </button>
          )}
          {banks.length >= MAX_BANKS && !showForm && (
            <p className="mt-4 text-sm text-yellow-800 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md shadow-sm flex items-center">
              <BadgeInfo className="inline mr-2 text-yellow-500" size={18} /> Maximum of {MAX_BANKS} banks added. Please manage existing entries.
            </p>
          )}
        </div>

        {/* Bank Form (Add/Edit) */}
        {showForm && (
          <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-lg mb-8 transition-all duration-300 ease-in-out transform scale-100 opacity-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{currentBank.id ? 'Edit Bank Details' : 'Add New Bank'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={currentBank.bankName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                  placeholder="e.g., HDFC Bank"
                  required
                />
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={currentBank.accountNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                  placeholder="e.g., 50100XXXXXXX"
                  required
                />
              </div>
              <div>
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">IFSC Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={currentBank.ifscCode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                  placeholder="e.g., HDFC000XXXX"
                  required
                />
              </div>
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">UPI ID (Optional)</label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={currentBank.upiId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                  placeholder="e.g., schoolname@upi"
                />
              </div>
              <div>
                <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-2">QR Code Image (Optional)</label>
                <input
                  type="file"
                  id="qrCode"
                  name="qrCode"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleQrCodeChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-colors"
                />
                {qrPreview && (
                  <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center flex-col sm:flex-row gap-3">
                    <img src={qrPreview} alt="QR Preview" className="max-w-[100px] max-h-[100px] object-contain rounded-sm shadow-sm" />
                    <span className="text-sm text-gray-700 font-medium">{currentBank.qrFileName || 'QR Code Preview'}</span>
                  </div>
                )}
                {currentBank.qrCodeBase64 && !qrPreview && (
                  <p className="mt-2 text-sm text-gray-600 flex items-center bg-blue-50 border-l-4 border-blue-400 p-2 rounded-md">
                    <Info size={16} className="mr-2 text-blue-500"/> QR Code already set. Upload new image to replace.
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { resetForm(); setAlert({ message: '', type: '' }); }}
                  className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
                >
                  <XCircle className="mr-2" size={20} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                >
                  <Save className="mr-2" size={20} />
                  {currentBank.id ? 'Save Changes' : 'Add Bank'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List of Added Banks */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Existing Banks</h2>
          {banks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No banks added yet. Click "Add New Bank" to get started.</p>
          ) : (
            <ul className="space-y-4">
              {banks.map((bank) => (
                <li key={bank.id} className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex-grow mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-1">
                      <Building size={20} className="mr-2 text-indigo-600" />
                      {bank.bankName}
                    </h3>
                    <p className="text-sm text-gray-700 ml-7"><span className="font-medium">Account:</span> {bank.accountNumber}</p>
                    <p className="text-sm text-gray-700 ml-7"><span className="font-medium">IFSC:</span> {bank.ifscCode}</p>
                    {bank.upiId && <p className="text-sm text-gray-700 ml-7"><span className="font-medium">UPI:</span> {bank.upiId}</p>}
                    {bank.qrCodeBase64 && (
                      <div className="mt-2 ml-7 flex items-center text-gray-600">
                        <QrCode size={18} className="mr-2 text-gray-500" />
                        <span className="text-sm">QR Code available</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => handleEdit(bank)}
                      className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      title="Edit Bank"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(bank.id)}
                      className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      title="Delete Bank"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
  );
};

export default BankModule;