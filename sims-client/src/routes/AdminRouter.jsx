// AdminRouter.jsx
import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import SIMSLogo from '../assets/sims.png';
import Menu from '../pages/admin/components/Menu';
import Navbar from '../pages/admin/components/Navbar';
import AdminPage from '../pages/admin/adminpage/AdminPage';
import ProfileModule from '../pages/admin/profile/ProfileModule';
import StudentModule from '../pages/admin/students/StudentModule';
import TeacherModule from '../pages/admin/teachers/TeacherModule';
import ParentModule from '../pages/admin/parents/ParentModule';
import FeeModule from '../pages/admin/fee/FeeModule';
import BankModule from '../pages/admin/bankaccount/BankModule';
import SubjectModule from '../pages/admin/subjects/SubjectModule';
import ClassModule from '../pages/admin/classes/ClassModule';
import ExamModule from '../pages/admin/exams/ExamModule';
import SchedulesModule from '../pages/admin/schedules/SchedulesModule';
import AssignmentModule from '../pages/admin/assignments/AssignmentModule';
import LibraryModule from '../pages/admin/library/LibraryModule';
import ResultsModule from '../pages/admin/results/ResultsModule';
import AttendanceModule from '../pages/admin/attendance/AttendanceModule';
import EventModule from '../pages/admin/events/EventModule';
import MessageModule from '../pages/admin/messages/MessageModule';
import AnnouncementModule from '../pages/admin/announcements/AnnouncementModule';
import AnnouncementOverviewModal from '../pages/admin/announcements/AnnouncementOverviewModal';
import HelpModule from '../pages/admin/help/HelpModule';
import { MessageProvider } from '../pages/admin/messages/MessageProvider';
import AnnouncementProvider from '../pages/admin/announcements/AnnouncementProvider';
import { ProfileProvider } from '../pages/admin/profile/ProfileContext';
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';
// Removed FaBars import as it will be in Navbar now

function AdminRouter() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProfileProvider>
      <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
        {/* Removed Mobile Header - Mobile toggle will be in Navbar */}

        {/* Sidebar Menu */}
        <Menu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnnouncementProvider>
            <MessageProvider>
              {/* Desktop and Mobile Navbar - now includes mobile toggle */}
              <Navbar 
                isMobileMenuOpen={isMobileMenuOpen} 
                setIsMobileMenuOpen={setIsMobileMenuOpen} 
              />
              
              {/* Content */}
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                <Routes>
                  <Route path="/" element={<AdminPage />} />
                  <Route path="/profile" element={<ProfileModule />} />
                  <Route path="/students" element={<StudentModule />} />
                  <Route path="/teachers" element={<TeacherModule />} />
                  <Route path="/parents" element={<ParentModule />} />
                  <Route path="/fee" element={<FeeModule />} />
                  <Route path="/bank" element={<BankModule />} />
                  <Route path="/subjects" element={<SubjectModule />} />
                  <Route path="/classes" element={<ClassModule />} />
                  <Route path="/exams" element={<ExamModule />} />
                  <Route path="/schedules" element={<SchedulesModule />} />
                  <Route path="/assignments" element={<AssignmentModule />} />
                  <Route path="/library" element={<LibraryModule />} />
                  <Route path="/results" element={<ResultsModule />} />
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

export default AdminRouter;