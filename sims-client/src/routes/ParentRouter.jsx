// src/routes/ParentRouter.jsx
import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import SIMSLogo from '../assets/sims.png';
import ParentMenu from '../pages/parent/components/Menu'; // Renamed import to ParentMenu
import Navbar from '../pages/parent/components/Navbar'; // Assuming this Navbar is specific to parent
import ParentPage from '../pages/parent/parentpage/ParentPage';
import ProfileModule from '../pages/parent/profile/ProfileModule';
import MyChildrenModule from '../pages/parent/mychildren/MyChildrenModule';
import FeeModule from '../pages/parent/fee/FeeModule';
import DiaryModule from '../pages/parent/diary/DiaryModule'
import ExamModule from '../pages/parent/exams/ExamModule';
import AttendanceModule from '../pages/parent/attendance/AttendanceModule';
import EventModule from '../pages/parent/events/EventModule';
import MessageModule from '../pages/parent/messages/MessageModule';
import AnnouncementModule from '../pages/parent/announcements/AnnouncementModule';
import AnnouncementOverviewModal from '../pages/parent/announcements/AnnouncementOverviewModal';
import HelpModule from '../pages/parent/help/HelpModule';
import { MessageProvider } from '../pages/parent/messages/MessageProvider';
import AnnouncementProvider from '../pages/parent/announcements/AnnouncementProvider';
import { ProfileProvider } from '../pages/parent/profile/ProfileContext';
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';
// FaBars is now imported and used inside Navbar, so no need to import here if not used directly
// import { FaBars } from 'react-icons/fa';

function ParentRouter() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProfileProvider>
      <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
        {/* Removed Mobile Header - Mobile toggle is now handled within the Navbar component */}

        {/* Sidebar Menu */}
        {/* Pass mobile menu state to the ParentMenu component */}
        <ParentMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Main Content Area */}
        {/* Adjust main content to take remaining width, adapting to sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnnouncementProvider>
            <MessageProvider>
              {/* Navbar component - now accepts mobile menu state */}
              <Navbar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />

              {/* Main content routing area */}
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                <Routes>
                  <Route path="/" element={<ParentPage />} />
                  {/* Ensure all routes are absolute and match menuItems href */}
                  <Route path="/profile" element={<ProfileModule />} />
                  <Route path="/mychildren" element={<MyChildrenModule />} />
                  <Route path="/fee" element={<FeeModule />} />
                  <Route path="/diary" element={<DiaryModule />} />
                  <Route path="/exams" element={<ExamModule />} />
                  <Route path="/attendance" element={<AttendanceModule />} />
                  <Route path="/messages" element={<MessageModule />} />
                  <Route path="/events" element={<EventModule />} />
                  <Route path="/announcements" element={<AnnouncementModule />} />
                  <Route path="/announcements/overview" element={<AnnouncementOverviewModal />} />
                  <Route path="/help" element={<HelpModule />} />
                  <Route path="/aboutus" element={<AboutUs />} />
                  <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                </Routes>
              </main>
            </MessageProvider>
          </AnnouncementProvider>
        </div>
      </div>
    </ProfileProvider>
  );
}

export default ParentRouter;