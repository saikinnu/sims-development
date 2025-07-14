// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { LogIn, AtSign, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ onClose, onForgotPasswordClick }) => {
  const [user_id, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Get credentials from environment variables (assuming Vite environment for import.meta.env)
  const getEnvCredentials = () => {
    return [
      {
        user_id: import.meta.env.VITE_SUPERADMIN_USERNAME,
        password: import.meta.env.VITE_SUPERADMIN_PASSWORD,
        role: 'superadmin',
        email: import.meta.env.VITE_SUPERADMIN_EMAIL
      }
      // {
      //   username: import.meta.env.VITE_ADMIN_USERNAME,
      //   password: import.meta.env.VITE_ADMIN_PASSWORD,
      //   role: 'admin',
      //   email: import.meta.env.VITE_ADMIN_EMAIL
      // }
      // {
      //   username: import.meta.env.VITE_TEACHER_USERNAME,
      //   password: import.meta.env.VITE_TEACHER_PASSWORD,
      //   role: 'teacher'
      // },
      // {
      //   username: import.meta.env.VITE_STUDENT_USERNAME,
      //   password: import.meta.env.VITE_STUDENT_PASSWORD,
      //   role: 'student'
      // },
      // {
      //   username: import.meta.env.VITE_PARENT_USERNAME,
      //   password: import.meta.env.VITE_PARENT_PASSWORD,
      //   role: 'parent'
      // }
    ].filter(user => user.user_id && user.password); // Filter out undefined credentials
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const users = getEnvCredentials();
    const superadmin = users.find(
      (u) => u.role === 'superadmin' && u.user_id === user_id && u.password === password
    );
  
    if (superadmin) {
      // Login as superadmin using env credentials
      console.log('Superadmin logged in');
      localStorage.setItem('authRole', superadmin.role); // optional
      navigate('/superadmin');
      if (onClose) onClose();
      return;
    }
  
    // For all other roles, send POST request to backend
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        user_id,
        password
      });
  
      const { token, role } = response.data;
      console.log(response.data);
  
      // Store token and role
      localStorage.setItem('authToken', JSON.stringify(token));
      const a = JSON.parse(localStorage.getItem('authToken'));
      console.log('a val is :',a);

      localStorage.setItem('authRole', JSON.stringify(role));
      localStorage.setItem('authUserID', JSON.stringify(user_id));
  
      // Navigate to dashboard based on role
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'parent':
          navigate('/parent');
          break;
        default:
          setError('Unknown user role.');
          return;
      }
  
      if (onClose) onClose();
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };
  
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setError('');

  //   const users = getEnvCredentials();
  //   const user = users.find(
  //     (u) => u.username === username && u.password === password
  //   );

  //   if (user) {
  //     // Login successful - In a real app, you'd store user session (e.g., in localStorage, context)
  //     console.log(`User ${user.username} logged in as ${user.role}`);
  //     switch (user.role) {
  //       case 'superadmin':
  //         navigate('/superadmin');
  //         break;
  //       case 'admin':
  //         navigate('/admin');
  //         break;
  //       case 'teacher':
  //         navigate('/teacher');
  //         break;
  //       case 'student':
  //         navigate('/student');
  //         break;
  //       case 'parent':
  //         navigate('/parent');
  //         break;
  //       default:
  //         setError('Unknown user role. Please contact support.');
  //         return; // Prevent onClose if role is unknown
  //     }

  //     if (onClose) onClose(); // Close the login modal/overlay if provided
  //   } else {
  //     setError('Invalid username or password.');
  //   }
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="p-4 bg-indigo-100 rounded-full mb-6">
        <LogIn size={48} className="text-indigo-600" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome Back!</h3>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div>
          <label htmlFor="user_id" className="block text-gray-700 text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="user_id"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Enter your Username or Email"
              value={user_id}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button" // Important: use type="button" to prevent form submission
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center text-gray-700">
            <input type="checkbox" className="form-checkbox text-indigo-600 rounded mr-2" />
            Remember me
          </label>
          <button
            type="button" // Important: use type="button" to prevent form submission
            onClick={onForgotPasswordClick}
            className="text-indigo-600 hover:underline focus:outline-none"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;