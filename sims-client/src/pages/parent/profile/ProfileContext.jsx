// src/context/ProfileContext.jsx
import React, { createContext, useState, useContext } from 'react';
export let role = "parent";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: 'Kushwinth Kumar',
    email: 'kushwinthkumar@gmail.com',
    phone: '+1 (555) 123-4567',
    role: 'Parent',
    bio: 'Highly experienced system administrator with comprehensive knowledge of infrastructure management and security protocols. Responsible for overseeing critical system operations and team leadership.',
    lastLogin: '2025-06-20 10:30 AM',
    school: 'Bengaluru Public School',
    profileImage: '/avatar.png'
  });

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
