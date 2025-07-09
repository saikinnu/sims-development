import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Building2, Mail, User, Key, Eye, EyeOff, Calendar } from 'lucide-react';

const AddAdmin = ({ admins, setAdmins, calculateRenewalDate }) => {
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    userId: '',
    password: '',
    confirmPassword: '',
    planType: 'monthly'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords don't match!");
      return;
    }

    if (admins.some(admin => admin.userId === formData.userId)) {
      setFormError('User ID already exists!');
      return;
    }
    if (admins.some(admin => admin.email === formData.email)) {
      setFormError('Email ID already exists!');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const renewalDate = calculateRenewalDate(formData.planType);

    // const newAdmin = {
    //   // id: Date.now(),
      // schoolName: formData.schoolName,
    //   email: formData.email,
    //   userId: formData.userId,
    //   status: true, // New admins are active by default
    //   password: formData.password,
    //   confirmPassword: formData.confirmPassword,
    //   createdAt: today,
    //   planType: formData.planType,
    //   renewalDate: renewalDate
    // };
    const newAdmin = {
      school_name: formData.schoolName,
      email: formData.email,
      user_id: formData.userId,
      password: formData.password,
      plan_type: formData.planType
    };
    
    console.log(newAdmin);
    try {
      const response = await axios.post('http://localhost:5000/api/admins/', newAdmin);
      // setAdmins(prev => [...prev, newAdmin]);
      // setFormData({
      //   schoolName: '',
      //   email: '',
      //   userId: '',
      //   password: '',
      //   confirmPassword: '',
      //   planType: 'monthly'
      // });
      // setFormError('');
      // setShowPassword(false);
      // setShowConfirmPassword(false);
    } catch (error) {
      console.error('Failed to add admin:', error);
      setFormError(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <PlusCircle className="mr-3 text-indigo-600 h-6 w-6" />
          Register New School Admin
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* School Name Input */}
          <div className="space-y-1">
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
              School Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all placeholder-gray-400"
                placeholder="e.g., Green Valley High"
                required
              />
            </div>
          </div>

          {/* Email ID Input */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all placeholder-gray-400"
                placeholder="admin@school.com"
                required
              />
            </div>
          </div>

          {/* User ID Input */}
          <div className="space-y-1">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              User ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all placeholder-gray-400"
                placeholder="unique_admin_id"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all placeholder-gray-400"
                placeholder="********"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all placeholder-gray-400"
                placeholder="********"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Plan Type Selection */}
          <div className="space-y-1">
            <label htmlFor="planType" className="block text-sm font-medium text-gray-700">
              Plan Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="planType"
                name="planType"
                value={formData.planType}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none bg-white"
                required
              >
                <option value="monthly">Monthly Plan</option>
                <option value="yearly">Yearly Plan</option>
              </select>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Admin
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddAdmin;