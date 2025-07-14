import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('authToken'));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authRole');
      localStorage.removeItem('authUserID');
      
      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication failed. Please log in again.'));
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function to get auth headers (for backward compatibility)
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('authToken'));
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to get token
export const getAuthToken = () => {
  return localStorage.getItem('token') || JSON.parse(localStorage.getItem('authToken'));
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export default api; 