import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import DonorDashboard from './DonorDashboard';
import TeacherDashboard from './TeacherDashboard';
import NgoDashboard from './NgoDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardDispatcher = () => {
  const { role } = useAuth();

  switch (role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'DONOR':
      return <DonorDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'NGO':
      return <NgoDashboard />;
    case 'STUDENT':
    default:
      return <StudentDashboard />;
  }
};

export default DashboardDispatcher;

