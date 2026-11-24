import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Authenticating user session..." fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <i className="bi bi-shield-x display-4 d-block mb-3 text-danger"></i>
          <h4 className="alert-heading">Access Denied</h4>
          <p className="mb-3">
            Your account role (<strong>{role}</strong>) does not have authorization to access this feature.
          </p>
          <a href="/dashboard" className="btn btn-outline-danger">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

