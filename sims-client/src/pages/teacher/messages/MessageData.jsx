import axios from 'axios';

// Fetch user data by ID from backend
export async function fetchUserById(id) {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch all users from backend
export async function fetchUsers() {
  try {
    const response = await axios.get('http://localhost:5000/api/users');
    return response.data;
  } catch (error) {
    throw error;
  }
}