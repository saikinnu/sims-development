// FeeData.js
import { feeAPI } from '../../../services/api';

/**
 * Fetches fee records for a specific student
 * @param {string} studentId - The student ID
 * @returns {Promise<Array>} Promise that resolves to array of fee records for the student
 */
export const fetchStudentFees = async (studentId) => {
  try {
    const response = await feeAPI.getStudentFees(studentId);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching student fees:', error);
    return [];
  }
};

/**
 * Processes a term fee payment
 * @param {string} feeId - The fee ID
 * @param {Object} paymentData - The payment data
 * @returns {Promise<Object>} Promise that resolves to the payment result
 */
export const payTermFee = async (feeId, paymentData) => {
  try {
    const response = await feeAPI.payTermFee(feeId, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error processing term fee payment:', error);
    throw error;
  }
};

// Export empty array as default for backward compatibility
export const feeRecordsData = [];