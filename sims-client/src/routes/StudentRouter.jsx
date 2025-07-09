// src/routes/StudentRouter.jsx
import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import SIMSLogo from '../assets/sims.png';
import StudentMenu from '../pages/student/components/Menu';
import Navbar from '../pages/student/components/Navbar'; // Assuming this Navbar is specific to student
import StudentPage from '../pages/student/studentpage/StudentPage';
import ProfileModule from '../pages/student/profile/ProfileModule';
import DiaryModule from '../pages/student/diary/DiaryModule'
import ExamModule from '../pages/student/exams/ExamModule';
import SchedulesModule from '../pages/student/schedules/SchedulesModule';
import AssignmentModule from '../pages/student/assignments/AssignmentModule'
import AssignmentSubmission from '../pages/student/assignments/AssignmentSubmission';
import LibraryModule from '../pages/student/library/LibraryModule';
import AttendanceModule from '../pages/student/attendance/AttendanceModule';
import EventModule from '../pages/student/events/EventModule';
import MessageModule from '../pages/student/messages/MessageModule';
import AnnouncementModule from '../pages/student/announcements/AnnouncementModule';
import AnnouncementOverviewModal from '../pages/student/announcements/AnnouncementOverviewModal';
import HelpModule from '../pages/student/help/HelpModule';
import { MessageProvider } from '../pages/student/messages/MessageProvider';
import AnnouncementProvider from '../pages/student/announcements/AnnouncementProvider';
import { ProfileProvider } from '../pages/student/profile/ProfileContext';
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';
// FaBars is now imported and used inside Navbar, so no need to import here if not used directly
// import { FaBars } from 'react-icons/fa';

function StudentRouter() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProfileProvider>
      <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
        {/* Removed Mobile Header - Mobile toggle will be in Navbar now */}

        {/* Sidebar Menu */}
        {/* Pass mobile menu state to the StudentMenu component */}
        <StudentMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

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
                  <Route path="/" element={<StudentPage />} />
                  {/* Ensure all routes are absolute and match menuItems href */}
                  <Route path="/profile" element={<ProfileModule />} />
                  <Route path="/diary" element={<DiaryModule />} />
                  <Route path="/exams" element={<ExamModule />} />
                  <Route path="/schedules" element={<SchedulesModule />} />
                  <Route path="/assignments" element={<AssignmentModule />} />
                  <Route path="/submit-assignment/:assignmentId" element={<AssignmentSubmission />} />
                  <Route path="/library" element={<LibraryModule />} />
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

export default StudentRouter;