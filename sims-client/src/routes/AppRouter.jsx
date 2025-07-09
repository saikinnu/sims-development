import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import AdminRouter from './AdminRouter';
import TeacherRouter from './TeacherRouter';
import StudentRouter from './StudentRouter';
import ParentRouter from './ParentRouter';
import SuperAdminRouter from './SuperAdminRouter';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/superadmin/*" element={<SuperAdminRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/teacher/*" element={<TeacherRouter />} />
      <Route path="/student/*" element={<StudentRouter />} />
      <Route path="/parent/*" element={<ParentRouter />} />
    </Routes>
  );
};

export default AppRouter;
