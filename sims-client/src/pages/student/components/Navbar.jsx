// src/pages/student/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAnnouncements } from '../announcements/AnnouncementProvider';
import { useMessages } from '../messages/MessageProvider';
import ProfileDropdown from '../profile/ProfileDropdown';
import { useProfile } from '../profile/ProfileContext';
import SIMSLogo from '../../../assets/sims.png'; // Path adjusted for student's context

// Import specific Font Awesome icons from 'react-icons/fa'
import { FaBars, FaComments, FaBullhorn } from 'react-icons/fa';

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => { // Accept props
  const { profileData } = useProfile();
  const { announcements } = useAnnouncements();
  const { unreadMessageCount } = useMessages();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAnnouncementCount = announcements.filter(ann => {
    const endDate = new Date(ann.endDate);
    // Ensure current date is within the announcement period (today < endDate)
    return ann.status === 'active' && new Date() <= endDate;
  }).length;

  return (
    <div className='flex items-center justify-between p-4 bg-white shadow-sm dark:bg-gray-800'>
      {/* Mobile Menu Toggle and Logo (visible on small screens) */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Toggle Mobile Menu"
        >
          <FaBars className="text-gray-600 text-xl" />
        </button>
        <Link to="/student" className="flex items-center gap-2"> {/* Link to /student base */}
          <img src={SIMSLogo} alt="SIMS Logo" className="h-10 w-15 animate-fade-in-down" />
        </Link>
      </div>

      {/* Welcome Back message (hidden on small screens, shown on medium and up) */}
      {/* On small screens, this will be hidden because the mobile menu toggle and logo are present */}
      <div className="flex-1 items-center gap-1 md:gap-2 text-sm hidden sm:flex">
        <h1 className="text-gray-700 dark:text-gray-300">Welcome Back,</h1>
        <p className="font-bold text-gray-900 dark:text-white">{profileData.name}</p>
      </div>

      <div className='flex items-center gap-4 sm:gap-6 ml-auto'> {/* Used ml-auto to push items to right */}
        {/* Messages Icon */}
        <div
          className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative hover:bg-gray-200'
          onClick={() => navigate('/student/messages')}
        >
          <FaComments className="text-gray-600 text-lg" />
          {unreadMessageCount > 0 && (
            <div className='absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs font-semibold border-2 border-white'>
              {unreadMessageCount}
            </div>
          )}
        </div>

        {/* Announcements Icon */}
        <div
          className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative hover:bg-gray-200'
          onClick={() => navigate('/student/announcements/overview')}
        >
          <FaBullhorn className="text-gray-600 text-lg" />
          {activeAnnouncementCount > 0 && (
            <div className='absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs font-semibold border-2 border-white'>
              {activeAnnouncementCount}
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-2">
            <div className='hidden sm:flex flex-col items-end'>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{profileData.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{profileData.role}</span>
            </div>
            <img
              src={profileData.profileImage}
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full w-8 h-8 object-cover" // Ensure perfect circle
            />
          </button>

          <ProfileDropdown
            isOpen={showProfileDropdown}
            onClose={() => setShowProfileDropdown(false)}
            onProfileClick={() => navigate('profile')}
            onSettingsClick={() => navigate('settings')}
            onAboutUsClick={() => navigate('aboutus')}
            onPrivacyPolicyClick={() => navigate('privacypolicy')}

            onLogout={() => navigate('/landing')}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;