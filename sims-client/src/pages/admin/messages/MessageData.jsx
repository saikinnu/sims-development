// MessageData.jsx

const mockUsers = [
  // Teachers
  { id: 'T001', name: 'Alice Smith', type: 'Teacher' },
  { id: 'T002', name: 'Bob Johnson', type: 'Teacher' },
  { id: 'T003', name: 'Carol White', type: 'Teacher' },

  // Students
  { id: 'S101', name: 'David Lee', type: 'Student' },
  { id: 'S102', name: 'Eva Green', type: 'Student' },
  { id: 'S103', name: 'Frank Black', type: 'Student' },

  // Parents
  { id: 'P201', name: 'Grace Hall', type: 'Parent' },
  { id: 'P202', name: 'Henry King', type: 'Parent' },

  // Staff
  { id: 'ST301', name: 'Ivy Stone', type: 'Staff' },
  { id: 'ST302', name: 'Jack Brown', type: 'Staff' },
];

/**
 * Simulates fetching users based on a search query or by ID.
 * In a real application, this would be an API call to your backend.
 *
 * @param {string} query The search string (can be an ID or part of a name).
 * @returns {Array} An array of user objects matching the query.
 */
export const fetchUsers = (query) => {
  if (!query) {
    // If no query, return a small sample or common contacts.
    // For this mock, we'll return all users, but in real app, you'd limit.
    return mockUsers.slice(0, 5);
  }
  const lowerCaseQuery = query.toLowerCase();
  return mockUsers.filter(user =>
    user.id.toLowerCase().includes(lowerCaseQuery) ||
    user.name.toLowerCase().includes(lowerCaseQuery)
  );
};

/**
 * Simulates fetching a single user by their ID.
 *
 * @param {string} id The user ID to look up.
 * @returns {object|null} The user object if found, otherwise null.
 */
export const fetchUserById = (id) => {
  return mockUsers.find(user => user.id === id) || null;
};

// Export the mock users array itself if needed elsewhere, though fetchUsers is generally better
export default mockUsers;