// superadmin/SuperAdminPage.jsx
import React, { useState, useEffect } from 'react';
// import { LogOut } from 'lucide-react'; // No longer needed directly here
import AddAdmin from './AddAdmin';
import AdminList from './AdminList';
import axios from 'axios';

const SuperAdminPage = () => {
  // State for the list of admins - central state management
  const [admins, setAdmins] = useState([]);

  // Utility function: Calculate renewal date based on plan type
  const calculateRenewalDate = (planType) => {
    const renewalDate = new Date();
    const today = new Date(); // This is the 'renewed date' if called at the time of renewal
    const renewal_date = new Date(today);

    if (planType === 'monthly') {
      renewalDate.setDate(renewal_date.getDate() + 30); // Add 30 days for monthly
    } else {
      renewalDate.setFullYear(renewal_date.getFullYear() + 1); // Add one year for yearly
    }

    return renewal_date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Utility function: Check if a plan is expired
  const isPlanExpired = (renewal_date) => {
    const today = new Date();
    const renewal = new Date(renewal_date);
    // Set both dates to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    renewal.setHours(0, 0, 0, 0);
    return today > renewal;
  };

  // Utility function: Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Simulate fetching admin data on component mount (Mock Data)
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admins/');
        const data = response.data;
        console.log(data);

        const updatedMockAdmins = data.map(admin => ({
          ...admin,
          status: !isPlanExpired(admin.renewal_date) // Set status to false if expired
      }));
      setAdmins(updatedMockAdmins);
        // setAdmins(data);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      }
    };
    fetchAdmins();
    // const mockAdmins = [
    //   {
    //     id: 1,
    //     schoolName: 'Global High School',
    //     email: 'admin.global@example.com',
    //     userId: 'global_admin',
    //     status: true,
    //     createdAt: '2025-06-01', // Created in the past
    //     planType: 'yearly',
    //     renewalDate: '2026-06-01' // Clearly active
    //   },
    //   {
    //     id: 2,
    //     schoolName: 'City Montessori School',
    //     email: 'admin.cms@example.com',
    //     userId: 'cms_admin',
    //     status: true, // Will become inactive due to expired plan by useEffect
    //     createdAt: '2025-05-15', // Created in the past
    //     planType: 'monthly',
    //     renewalDate: '2025-06-14' // Expired as of July 2, 2025. Today is July 2, 2025.
    //   },
    //   {
    //     id: 3,
    //     schoolName: 'Oakwood Academy',
    //     email: 'admin.oak@example.com',
    //     userId: 'oak_admin',
    //     status: true,
    //     createdAt: '2025-06-10', // Created recently
    //     planType: 'monthly',
    //     renewalDate: '2025-07-10' // Active, renews in 30 days
    //   },
    //   {
    //     id: 4,
    //     schoolName: 'Sunshine Public School',
    //     email: 'admin.sun@example.com',
    //     userId: 'sun_admin',
    //     status: true,
    //     createdAt: '2024-12-01', // Created long ago
    //     planType: 'yearly',
    //     renewalDate: '2025-12-01' // Active for a few more months
    //   },
    //   {
    //     id: 5,
    //     schoolName: 'Pinecrest Elementary',
    //     email: 'admin.pine@example.com',
    //     userId: 'pine_admin',
    //     status: true, // Will become inactive due to expired plan by useEffect
    //     createdAt: '2025-05-01', // Created in the past
    //     planType: 'monthly',
    //     renewalDate: '2025-05-31' // Expired as of July 2, 2025
    //   }
    // ];

    // Update the 'status' based on 'renewalDate' for mock data
    // const updatedMockAdmins = data.map(admin => ({
    //     ...admin,
    //     status: !isPlanExpired(admin.renewalDate) // Set status to false if expired
    // }));
    // setAdmins(updatedMockAdmins);
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      <div className="max-w-8xl mx-auto p-4 md:p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all school admin accounts</p>
          </div>
        </div>

        {/* Add New Admin Section */}
        <AddAdmin
          admins={admins} // Pass admins to check for duplicates
          setAdmins={setAdmins}
          calculateRenewalDate={calculateRenewalDate}
        />

        {/* Registered Admin Accounts Section */}
        <AdminList
          admins={admins}
          setAdmins={setAdmins}
          calculateRenewalDate={calculateRenewalDate}
          isPlanExpired={isPlanExpired}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default SuperAdminPage;