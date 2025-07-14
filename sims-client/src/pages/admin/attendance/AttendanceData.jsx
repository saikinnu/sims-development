// AttendanceData.jsx
import { teacherAPI } from '../../../services/api';

/**
 * Fetches all teachers from the backend
 * @returns {Promise<Array>} Promise that resolves to array of teachers
 */
export const fetchTeachers = async () => {
  try {
    const response = await teacherAPI.getAllTeachers();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
};

/**
 * Fetches a specific teacher by ID
 * @param {string} teacherId - The teacher ID
 * @returns {Promise<Object>} Promise that resolves to teacher object
 */
export const fetchTeacherById = async (teacherId) => {
  try {
    const response = await teacherAPI.getTeacherById(teacherId);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher by ID:', error);
    return null;
  }
};

// Export empty array as default for backward compatibility
export const teachersData = [];

export const studentsData = [
  {
    id: 1,
    studentId: "1234567890",
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "1B",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    studentId: "1234567890",
    name: "Jane Doe",
    email: "jane@doe.com",
    photo:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 3,
    studentId: "1234567890",
    name: "Mike Geller",
    email: "mike@geller.com",
    photo:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 4,
    studentId: "1234567890",
    name: "Jay French",
    email: "jay@gmail.com",
    photo:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 5,
    studentId: "1234567890",
    name: "Jane Smith",
    email: "jane@gmail.com",
    photo:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 6,
    studentId: "1234567890",
    name: "Anna Santiago",
    email: "anna@gmail.com",
    photo:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 7,
    studentId: "1234567890",
    name: "Allen Black",
    email: "allen@black.com",
    photo:
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 8,
    studentId: "1234567890",
    name: "Ophelia Castro",
    email: "ophelia@castro.com",
    photo:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 9,
    studentId: "1234567890",
    name: "Derek Briggs",
    email: "derek@briggs.com",
    photo:
      "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 10,
    studentId: "1234567890",
    name: "John Glover",
    email: "john@glover.com",
    photo:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    grade: 5,
    class: "5A",
    address: "123 Main St, Anytown, USA",
  },
];

