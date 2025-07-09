import React, { useState, useEffect, useMemo } from 'react';
import {
    CreditCard,
    Banknote,
    QrCode,
    ChevronDown,
    ChevronUp,
    Loader2,
    CheckCircle,
    IndianRupee,
    ExternalLink,
    AlertCircle,
    User,
    Clipboard,
    GraduationCap
} from 'lucide-react';
import { FaUsers, FaCheckCircle } from "react-icons/fa"; // Import FaUsers and FaCheckCircle for child selection UI
import html2canvas from 'html2canvas'; // Keep for PDF functionality
import jsPDF from 'jspdf'; // Keep for PDF functionality

// Import QR code images directly since they are in the same folder
// Ensure these paths are correct relative to where FeeModule.jsx is located
import hdfcQrCode from './hdfc_qr.png';
import iciciQrCode from './icici_qr.png';
import axisQrCode from './axis_qr.png';
import upiQrCode from './upi_qr.png';

// Payment Gateway Icon URLs
const PAYTM_ICON_URL = 'https://img-cdn.thepublive.com/filters:format(webp)/sambad-english/media/post_attachments/wp-content/uploads/2017/02/Paytm.png';
const GPAY_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png';
const PHONEPE_ICON_URL = 'https://cdn.worldvectorlogo.com/logos/phonepe-1.svg';


const FeeModule = () => {
    // Mock data for parent and children (similar to other modules)
    const [parentInfo] = useState({
        children: [
            {
                id: 'child1',
                name: 'Raj Kumar',
                rollNumber: 'YSSAB',
                studentId: '65764',
                class: '10',
                section: 'A',
                profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            },
            {
                id: 'child2',
                name: 'Priya Sharma',
                rollNumber: 'ZXCDE',
                studentId: '78901',
                class: '9',
                section: 'B',
                profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            }
        ]
    });

    // Mock fee data for each child
    const [allStudentFeeData, setAllStudentFeeData] = useState({
        'child1': [
            { term: '1st Term', feeType: 'Tuition Fee', amount: 5000, dueDate: '2023-06-15', status: 'Pending' },
            { term: '2nd Term', feeType: 'Exam Fee', amount: 3000, dueDate: '2023-09-15', status: 'Pending' },
            { term: '3rd Term', feeType: 'Library Fee', amount: 2000, dueDate: '2023-12-15', status: 'Pending' }
        ],
        'child2': [
            { term: '1st Term', feeType: 'Tuition Fee', amount: 4500, dueDate: '2023-07-01', status: 'Pending' },
            { term: '2nd Term', feeType: 'Sports Fee', amount: 1500, dueDate: '2023-10-01', status: 'Paid' },
            { term: '3rd Term', feeType: 'Lab Fee', amount: 2500, dueDate: '2024-01-01', status: 'Pending' }
        ]
    });

    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(''); // Stores 'Credit Card', 'Bank Transfer', 'UPI'
    const [selectedBank, setSelectedBank] = useState(''); // Used for Bank Transfer QR selection
    const [selectedGateway, setSelectedGateway] = useState(''); // Stores 'Google Pay', 'Paytm', 'PhonePe'
    const [transactionId, setTransactionId] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Set initial selected child and their fee data
    useEffect(() => {
        if (parentInfo.children && parentInfo.children.length > 0) {
            setSelectedChildId(parentInfo.children[0].id);
        }
    }, [parentInfo.children]);

    // Derived student data for the selected child
    const studentData = useMemo(() => {
        return parentInfo.children.find(child => child.id === selectedChildId);
    }, [selectedChildId, parentInfo.children]);

    // Derived fee details for the selected child
    const feeDetails = useMemo(() => {
        return allStudentFeeData[selectedChildId] || [];
    }, [selectedChildId, allStudentFeeData]);

    // Handle term selection
    const handleTermSelect = (term) => {
        // If the same term is clicked, unselect it
        if (selectedTerm === term) {
            setSelectedTerm(null);
        } else {
            setSelectedTerm(term);
        }
        // Reset payment-related states when a new term is selected or unselected
        setPaymentMethod('');
        setSelectedBank('');
        setSelectedGateway(''); // Reset gateway selection
        setTransactionId('');
        setShowReceipt(false);
        setPaymentSuccess(false);
    };

    // Simulate gateway redirection and payment
    const simulateGatewayPayment = (gatewayName, amount) => {
        setIsProcessing(true);
        setPaymentSuccess(false); // Reset success state
        setShowReceipt(false); // Hide receipt during processing

        // In a real app, this would redirect to a payment gateway.
        // For simulation, we use an alert.
        alert(`Redirecting to ${gatewayName} for payment of ₹${amount.toLocaleString()}...`);

        // Simulate payment completion after a delay
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
            setShowReceipt(true); // Show receipt after simulated payment

            // In a real scenario, you'd receive a transaction ID from the gateway
            // For simulation, let's just use a dummy one
            setTransactionId(`TXN${Date.now()}`);

            // Update fee status for the paid term for the specific child
            setAllStudentFeeData(prevData => ({
                ...prevData,
                [selectedChildId]: prevData[selectedChildId].map(fee =>
                    fee.term === selectedTerm ? { ...fee, status: 'Paid' } : fee
                )
            }));

        }, 2500); // Simulate 2.5 seconds for payment gateway interaction
    };

    const currentSelectedFee = feeDetails.find(fee => fee.term === selectedTerm);

    // Handle child selection
    const handleChildSelect = (childId) => {
        setSelectedChildId(childId);
        // Reset all payment states when child changes
        setSelectedTerm(null);
        setPaymentMethod('');
        setSelectedBank('');
        setSelectedGateway('');
        setTransactionId('');
        setShowReceipt(false);
        setPaymentSuccess(false);
        setIsProcessing(false);
    };

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                {/* Header */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2 mb-4 sm:mb-0 text-center sm:text-left">
                        <IndianRupee className="mr-3 text-indigo-600 size-7 sm:size-8" />
                        Fee Payment Portal
                    </h1>

                {/* Children Selector */}
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {parentInfo.children.map(child => (
                            <div
                                key={child.id}
                                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out
                                    ${selectedChildId === child.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'}`}
                                onClick={() => handleChildSelect(child.id)}
                            >
                                <img
                                    src={child.profilePic}
                                    alt={child.name}
                                    className="rounded-full mr-3 border border-gray-200"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div className="flex-grow">
                                    <h6 className="mb-0 font-semibold text-gray-800 text-base">{child.name}</h6>
                                    <small className="text-gray-500 text-xs sm:text-sm">
                                        {child.grade} {child.rollNumber && `• Roll No: ${child.rollNumber}`}
                                    </small>
                                </div>
                                {selectedChildId === child.id && (
                                    <FaCheckCircle className="text-indigo-500 ml-auto" size={20} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display message if no child is selected or no children exist */}
                {!selectedChildId && (
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-center justify-center mb-6 shadow-sm text-sm sm:text-base">
                        <AlertCircle className="mr-2" size={20} />
                        Please select a child to view their fee details.
                    </div>
                )}

                {selectedChildId && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Left Section: Student Information & Fee Details */}
                        <div>
                            {/* Student Information */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 mb-6 shadow-md">
                                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-800 flex items-center">
                                    <User className="mr-2 text-blue-600 size-5 sm:size-6" /> Student Information
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                                        <User className="text-gray-500 mr-2 size-4 sm:size-5" />
                                        <span className="text-sm sm:text-base text-gray-900 font-medium">{studentData.name}</span>
                                    </div>
                                    <div className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                                        <Clipboard className="text-gray-500 mr-2 size-4 sm:size-5" />
                                        <span className="text-sm sm:text-base text-gray-900">ID: <span className="font-medium">{studentData.studentId}</span></span>
                                    </div>
                                    <div className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                                        <GraduationCap className="text-gray-500 mr-2 size-4 sm:size-5" />
                                        <span className="text-sm sm:text-base text-gray-900">Class: <span className="font-medium">{studentData.class}-{studentData.section}</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Details List */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                                <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                                    <Banknote className="mr-2 text-green-600 size-5 sm:size-6" /> Fee Details
                                </h2>

                                {feeDetails.length === 0 ? (
                                    <div className="text-center text-gray-500 py-4 text-sm sm:text-base">No fee records found for this child.</div>
                                ) : (
                                    feeDetails.map((fee) => (
                                        <div
                                            key={fee.term}
                                            className={`border rounded-lg p-3 sm:p-4 mb-3 transition-all duration-200 ease-in-out transform hover:scale-[1.01]
                                                ${fee.status === 'Paid'
                                                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-gray-600 cursor-not-allowed opacity-90'
                                                    : 'bg-white cursor-pointer hover:shadow-md'
                                                } ${selectedTerm === fee.term ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500' : 'border-gray-200'}`}
                                            onClick={() => fee.status !== 'Paid' && handleTermSelect(fee.term)}
                                        >
                                            <div className="flex justify-between items-start"> {/* Changed items-center to items-start */}
                                                <div>
                                                    <h3 className="font-medium text-sm sm:text-base text-gray-800">{fee.term} - {fee.feeType}</h3>
                                                    <p className={`text-xs sm:text-sm ${fee.status === 'Overdue' ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                                        Due: {fee.dueDate}
                                                    </p>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2"> {/* Adjusted for mobile stacking */}
                                                    <p className="font-bold text-base sm:text-lg text-gray-900">₹{fee.amount.toLocaleString()}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                                        fee.status === 'Paid'
                                                            ? 'bg-green-200 text-green-800'
                                                            : fee.status === 'Overdue'
                                                                ? 'bg-red-200 text-red-800'
                                                                : 'bg-yellow-200 text-yellow-800'
                                                        }`}>
                                                        {fee.status}
                                                    </span>
                                                    {fee.status !== 'Paid' && (selectedTerm === fee.term ? <ChevronUp size={18} className="text-indigo-500" /> : <ChevronDown size={18} className="text-gray-500" />)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Section: Payment Method & Form */}
                        <div className="flex flex-col">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-800 flex items-center">
                                <CreditCard className="mr-2 text-purple-600 size-5 sm:size-6" /> Payment Method
                            </h2>
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-6 flex-grow flex flex-col">
                                {/* Payment Method Buttons */}
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('Credit Card'); setSelectedBank(''); setSelectedGateway(''); setTransactionId(''); }}
                                        disabled={!selectedTerm || (currentSelectedFee && currentSelectedFee.status === 'Paid') || isProcessing}
                                        className={`w-full p-3 sm:p-4 border rounded-lg flex items-center justify-start text-base sm:text-lg font-medium transition-all duration-200 transform hover:scale-[1.01]
                                            ${paymentMethod === 'Credit Card'
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-500'
                                                : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:shadow-sm'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <CreditCard className="mr-3 size-5 sm:size-6" />
                                        Credit Card
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('Bank Transfer'); setSelectedBank(''); setSelectedGateway(''); setTransactionId(''); }}
                                        disabled={!selectedTerm || (currentSelectedFee && currentSelectedFee.status === 'Paid') || isProcessing}
                                        className={`w-full p-3 sm:p-4 border rounded-lg flex items-center justify-start text-base sm:text-lg font-medium transition-all duration-200 transform hover:scale-[1.01]
                                            ${paymentMethod === 'Bank Transfer'
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-500'
                                                : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:shadow-sm'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <Banknote className="mr-3 size-5 sm:size-6" />
                                        Bank Transfer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('UPI'); setSelectedBank(''); setSelectedGateway(''); setTransactionId(''); }}
                                        disabled={!selectedTerm || (currentSelectedFee && currentSelectedFee.status === 'Paid') || isProcessing}
                                        className={`w-full p-3 sm:p-4 border rounded-lg flex items-center justify-start text-base sm:text-lg font-medium transition-all duration-200 transform hover:scale-[1.01]
                                            ${paymentMethod === 'UPI'
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-500'
                                                : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:shadow-sm'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <QrCode className="mr-3 size-5 sm:size-6" />
                                        UPI
                                    </button>
                                </div>

                                {/* Conditional sections based on payment method */}
                                {selectedTerm && (paymentMethod === 'Bank Transfer' || paymentMethod === 'UPI') && !paymentSuccess && (
                                    <div className="space-y-4 sm:space-y-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                                        {/* Bank Transfer QR Codes and Account Info */}
                                        {paymentMethod === 'Bank Transfer' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">Select Bank or Scan QR</label>
                                                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                                                    {['HDFC Bank', 'ICICI Bank', 'AXIS Bank'].map((bankName) => (
                                                        <div
                                                            key={bankName}
                                                            className={`flex flex-col items-center p-2 sm:p-3 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.03]
                                                                ${selectedBank === bankName ? 'border-indigo-500 ring-2 ring-indigo-500 bg-white shadow-md' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                                            onClick={() => setSelectedBank(bankName)}
                                                        >
                                                            <img
                                                                src={
                                                                    bankName === 'HDFC Bank' ? hdfcQrCode :
                                                                    bankName === 'ICICI Bank' ? iciciQrCode :
                                                                    axisQrCode
                                                                }
                                                                alt={`${bankName} QR Code`}
                                                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2"
                                                            />
                                                            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{bankName}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {selectedBank && (
                                                    <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-sm sm:text-base">
                                                        <p className="font-semibold text-gray-800 mb-2">{selectedBank} Account Details:</p>
                                                        <p className="text-gray-700">Account Name: School Name Trust</p>
                                                        <p className="text-gray-700">Account Number: <span className="font-mono">{selectedBank === 'HDFC Bank' ? '50100XXXXXXX' : selectedBank === 'ICICI Bank' ? '00010XXXXXXX' : '90000XXXXXXX'}</span></p>
                                                        <p className="text-gray-700">IFSC Code: <span className="font-mono">{selectedBank === 'HDFC Bank' ? 'HDFC000XXXX' : selectedBank === 'ICICI Bank' ? 'ICIC000XXXX' : 'UTIB000XXXX'}</span></p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* UPI QR Code */}
                                        {paymentMethod === 'UPI' && (
                                            <div className="text-center">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">Scan to Pay via UPI</label>
                                                <div className="flex justify-center mb-4">
                                                    <img src={upiQrCode} alt="UPI QR Code" className="w-32 h-32 sm:w-48 sm:h-48 object-contain border border-gray-300 rounded-lg p-2 bg-white shadow-md" />
                                                </div>
                                                <p className="text-sm text-gray-700 font-medium text-center mb-4">UPI ID: <span className="font-mono">schoolname@upi</span></p>
                                            </div>
                                        )}

                                        {/* Payment Gateway Selection */}
                                        {(selectedBank || paymentMethod === 'UPI') && (
                                            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                                <h3 className="text-base sm:text-md font-semibold text-gray-800 mb-4 flex items-center">
                                                    <ExternalLink className="mr-2 text-indigo-500 size-5 sm:size-6" />
                                                    Choose a Payment Gateway to Proceed
                                                </h3>
                                                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                                    {['Google Pay', 'Paytm', 'PhonePe'].map((gateway) => (
                                                        <button
                                                            key={gateway}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedGateway(gateway);
                                                                simulateGatewayPayment(gateway, currentSelectedFee.amount);
                                                            }}
                                                            disabled={isProcessing}
                                                            className={`flex flex-col items-center justify-center p-3 sm:p-4 border rounded-lg text-sm sm:text-base font-medium transition-all duration-200 transform hover:scale-[1.03]
                                                                ${selectedGateway === gateway ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-gray-300 bg-white hover:border-indigo-400 hover:shadow-sm'}
                                                                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                                            `}
                                                        >
                                                            {/* Icons only */}
                                                            {gateway === 'Google Pay' && <img src={GPAY_ICON_URL} alt="Google Pay" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />}
                                                            {gateway === 'Paytm' && <img src={PAYTM_ICON_URL} alt="Paytm" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />}
                                                            {gateway === 'PhonePe' && <img src={PHONEPE_ICON_URL} alt="PhonePe" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Transaction ID Input (after payment is simulated) */}
                                {paymentSuccess && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm sm:text-base">
                                        <label htmlFor="transactionId" className="block font-medium text-green-800 mb-1">
                                            Confirmed Transaction ID (from Gateway)
                                        </label>
                                        <input
                                            type="text"
                                            id="transactionId"
                                            className="w-full border border-green-300 rounded-md p-2 sm:p-3 text-green-900 bg-white focus:outline-none"
                                            value={transactionId}
                                            readOnly // Make it read-only as it's provided after successful payment
                                        />
                                        <p className="text-xs text-green-700 mt-2">This ID confirms your payment from the gateway.</p>
                                    </div>
                                )}

                                {/* Note: Credit Card typically opens a gateway, so no direct transaction ID input here */}
                                {selectedTerm && paymentMethod === 'Credit Card' && !paymentSuccess && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-sm text-blue-700">
                                        <p>You will be redirected to a secure payment gateway for Credit Card processing.</p>
                                        <button
                                            type="button"
                                            onClick={() => simulateGatewayPayment('Credit Card Gateway', currentSelectedFee.amount)}
                                            disabled={isProcessing}
                                            className="mt-3 w-full bg-blue-600 text-white py-2.5 px-4 rounded-md text-sm font-semibold flex items-center justify-center hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                        >
                                            {isProcessing ? <Loader2 className="mr-2 animate-spin size-5" /> : <ExternalLink className="mr-2 size-5" />}
                                            {isProcessing ? 'Redirecting...' : 'Proceed to Gateway'}
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center mt-4">
                                    <input
                                        type="checkbox"
                                        id="receiptCheck"
                                        checked={showReceipt}
                                        onChange={(e) => setShowReceipt(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        disabled={!paymentSuccess && !isProcessing} // Disable if no payment success or currently processing
                                    />
                                    <label htmlFor="receiptCheck" className="ml-2 block text-sm text-gray-900">
                                        Show Payment Receipt
                                    </label>
                                </div>

                                {paymentSuccess && (
                                    <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center justify-center text-center font-medium mt-6 text-sm sm:text-base shadow-sm">
                                        <CheckCircle className="mr-2 size-5" />
                                        Payment successful for **{currentSelectedFee?.term}**!
                                    </div>
                                )}

                                {/* The primary 'Pay' button is now replaced by gateway specific buttons or disabled if processing */}
                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    <button
                                        type="button" // Changed to type="button" as it no longer submits the main form
                                        disabled={true} // Always disabled, as payment happens via gateway buttons
                                        className="w-full bg-indigo-300 text-white py-3 px-6 rounded-lg text-lg font-semibold flex items-center justify-center cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-3 animate-spin size-6" />
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay ₹${currentSelectedFee ? currentSelectedFee.amount.toLocaleString() : '0'}`
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default FeeModule;
