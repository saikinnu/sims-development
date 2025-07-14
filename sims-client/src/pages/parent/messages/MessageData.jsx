// MessageData.jsx
import { messageAPI } from '../../../services/api';

/**
 * Fetches users for messaging based on a search query.
 * For the student panel, it only returns 'Teacher' or 'Student' types.
 *
 * @param {string} query The search string.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects matching the query and allowed types.
 */
export const fetchUsers = async (query) => {
  try {
    const allowedTypes = ['Teacher', 'Student']; // Students can only message teachers and other students
    
    // This would need to be implemented in the backend
    // For now, we'll return an empty array and handle this in the backend
    const response = await messageAPI.getAllMessages({ 
      search: query,
      allowedTypes: allowedTypes 
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * Fetches a single user by their ID.
 *
 * @param {string} id The user ID to look up.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, otherwise null.
 */
export const fetchUserById = async (id) => {
  try {
    const allowedTypes = ['Teacher', 'Student']; // Students can only message teachers and other students
    
    // This would need to be implemented in the backend
    // For now, we'll return null and handle this in the backend
    const response = await messageAPI.getMessageById(id);
    const user = response.data;
    return user && allowedTypes.includes(user.type) ? user : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

// Export empty array as default for backward compatibility
export default [];