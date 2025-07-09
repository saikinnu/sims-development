// MessageData.jsx

const mockUsers = [
  // Teachers
  { id: 'T001', name: 'Mr. Davis', type: 'Teacher' },
  { id: 'T002', name: 'Ms. Evans', type: 'Teacher' },
  { id: 'T003', name: 'Dr. Frank', type: 'Teacher' },

];

/**
 * Simulates fetching users based on a search query (ID or name).
 * For the student panel, it only returns 'Teacher' or 'Student' types.
 *
 * @param {string} query The search string.
 * @returns {Array} An array of user objects matching the query and allowed types.
 */
export const fetchUsers = (query) => {
  const allowedTypes = ['Teacher', 'Student']; // Students can only message teachers and other students

  if (!query) {
    // Return a small sample of allowed types for initial suggestions
    return mockUsers.filter(user => allowedTypes.includes(user.type)).slice(0, 5);
  }
  const lowerCaseQuery = query.toLowerCase();
  return mockUsers.filter(user =>
    (user.id.toLowerCase().includes(lowerCaseQuery) ||
     user.name.toLowerCase().includes(lowerCaseQuery)) &&
    allowedTypes.includes(user.type) // Filter by allowed types
  );
};

/**
 * Simulates fetching a single user by their ID.
 *
 * @param {string} id The user ID to look up.
 * @returns {object|null} The user object if found, otherwise null.
 */
export const fetchUserById = (id) => {
  const allowedTypes = ['Teacher', 'Student']; // Students can only message teachers and other students
  const user = mockUsers.find(u => u.id === id);
  return user && allowedTypes.includes(user.type) ? user : null; // Return null if type is not allowed
};

export default mockUsers;