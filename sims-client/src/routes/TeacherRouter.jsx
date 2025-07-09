// src/routes/TeacherRouter.jsx
import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import SIMSLogo from '../assets/sims.png';
import TeacherMenu from '../pages/teacher/components/Menu'; // Renamed import to TeacherMenu
import Navbar from '../pages/teacher/components/Navbar'; // Assuming this Navbar is specific to teacher
import TeacherPage from '../pages/teacher/teacherpage/TeacherPage';
import ProfileModule from '../pages/teacher/profile/ProfileModule';
import StudentModule from '../pages/teacher/students/StudentModule';
import ParentModule from '../pages/teacher/parents/ParentModule';
import MyClassesModule from '../pages/teacher/myclasses/MyClassesModule';
import DiaryModule from '../pages/teacher/diary/DiaryModule'
import ExamModule from '../pages/teacher/exams/ExamModule';
import SchedulesModule from '../pages/teacher/schedules/SchedulesModule';
import AssignmentModule from '../pages/teacher/assignments/AssignmentModule';
import LibraryModule from '../pages/teacher/library/LibraryModule';
import AttendanceModule from '../pages/teacher/attendance/AttendanceModule';
import EventModule from '../pages/teacher/events/EventModule';
import MessageModule from '../pages/teacher/messages/MessageModule';
import AnnouncementModule from '../pages/teacher/announcements/AnnouncementModule';
import AnnouncementOverviewModal from '../pages/teacher/announcements/AnnouncementOverviewModal';
import HelpModule from '../pages/teacher/help/HelpModule';
import { MessageProvider } from '../pages/teacher/messages/MessageProvider';
import AnnouncementProvider from '../pages/teacher/announcements/AnnouncementProvider';
import { ProfileProvider } from '../pages/teacher/profile/ProfileContext';
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';
// FaBars is now imported and used inside Navbar, so no need to import here if not used directly
// import { FaBars } from 'react-icons/fa';

function TeacherRouter() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProfileProvider>
      <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
        {/* Removed Mobile Header - Mobile toggle will be in Navbar now */}

        {/* Sidebar Menu */}
        {/* Pass mobile menu state to the TeacherMenu component */}
        <TeacherMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

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
                  <Route path="/" element={<TeacherPage />} />
                  {/* Ensure all routes are absolute and match menuItems href */}
                  <Route path="/profile" element={<ProfileModule />} />
                  <Route path="/students" element={<StudentModule />} />
                  <Route path="/parents" element={<ParentModule />} />
                  <Route path="/myclasses" element={<MyClassesModule />} />
                  <Route path="/diary" element={<DiaryModule />} />
                  <Route path="/exams" element={<ExamModule />} />
                  <Route path="/schedules" element={<SchedulesModule />} />
                  <Route path="/assignments" element={<AssignmentModule />} />
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

export default TeacherRouter;