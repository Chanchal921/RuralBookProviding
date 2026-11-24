import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LibraryPage from './pages/LibraryPage';
import ResourceDetailsPage from './pages/ResourceDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Pages
import ProfilePage from './pages/ProfilePage';
import UploadResourcePage from './pages/UploadResourcePage';
import MyUploadsPage from './pages/MyUploadsPage';
import RequestResourcePage from './pages/RequestResourcePage';
import MyRequestsPage from './pages/MyRequestsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import DashboardDispatcher from './pages/dashboards/DashboardDispatcher';

// Admin Pages
import AdminPendingApprovalsPage from './pages/admin/AdminPendingApprovalsPage';
import AdminResourceManagementPage from './pages/admin/AdminResourceManagementPage';
import AdminRequestManagementPage from './pages/admin/AdminRequestManagementPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Dashboard & Profile */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardDispatcher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Resource Management for Donors, Teachers, NGOs, Admins */}
          <Route
            path="/resources/upload"
            element={
              <ProtectedRoute allowedRoles={['DONOR', 'TEACHER', 'NGO', 'ADMIN']}>
                <UploadResourcePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-uploads"
            element={
              <ProtectedRoute allowedRoles={['DONOR', 'TEACHER', 'NGO', 'ADMIN']}>
                <MyUploadsPage />
              </ProtectedRoute>
            }
          />

          {/* Resource Requests for Students, Teachers, NGOs, Admins */}
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'NGO', 'ADMIN']}>
                <RequestResourcePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'NGO', 'ADMIN']}>
                <MyRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Dedicated Routes */}
          <Route
            path="/admin/pending"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPendingApprovalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resources"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminResourceManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminRequestManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUserManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="container py-5 text-center">
                <h1 className="display-4 fw-bold text-success">404</h1>
                <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
                <p className="text-muted mb-4">The requested page does not exist or has been moved.</p>
                <a href="/" className="btn btn-primary-edu">Return to Home</a>
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;

