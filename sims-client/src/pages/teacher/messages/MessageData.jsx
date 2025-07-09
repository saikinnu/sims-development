// MessageData.jsx

const mockUsers = [
  // Teachers
  { id: 'T001', name: 'Mr. Davis', type: 'Teacher' },
  { id: 'T002', name: 'Ms. Evans', type: 'Teacher' },
  { id: 'T003', name: 'Dr. Frank', type: 'Teacher' },

  // Students
  { id: 'S101', name: 'Alice Brown', type: 'Student' },
  { id: 'S102', name: 'Bob Green', type: 'Student' },
  { id: 'S103', name: 'Charlie White', type: 'Student' },
  { id: 'S104', name: 'Diana Prince', type: 'Student' },

  // Parents
  { id: 'P201', name: 'Emily Clark (Parent of S101)', type: 'Parent' },
  { id: 'P202', name: 'George Harris (Parent of S102)', type: 'Parent' },
  { id: 'P203', name: 'Fiona Adams (Parent of S103)', type: 'Parent' },
];

/**
 * Simulates fetching users based on a search query (ID or name).
 * Filters by 'Teacher', 'Student', or 'Parent' types.
 *
 * @param {string} query The search string.
 * @returns {Array} An array of user objects matching the query.
 */
export const fetchUsers = (query) => {
  if (!query) {
    // In a real app, you might return recently contacted users or a small sample.
    // For this mock, return a mix of types for initial suggestions.
    return mockUsers.filter(user => ['T001', 'S101', 'P201'].includes(user.id));
  }
  const lowerCaseQuery = query.toLowerCase();
  return mockUsers.filter(user =>
    (user.id.toLowerCase().includes(lowerCaseQuery) ||
     user.name.toLowerCase().includes(lowerCaseQuery)) &&
    (user.type === 'Teacher' || user.type === 'Student' || user.type === 'Parent')
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

export default mockUsers;