import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';

const ProfilePage = () => {
  const { user, role } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-md-9 col-lg-10 p-4">
          <div className="mb-4 pb-2 border-bottom">
            <h3 className="fw-bold text-dark mb-1">User Profile</h3>
            <p className="text-muted small mb-0">Your registered account details and role permissions</p>
          </div>

          <div className="row">
            <div className="col-md-8 col-lg-6">
              <div className="bg-white p-4 rounded-3 border shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  <div
                    className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3"
                    style={{ width: '64px', height: '64px' }}
                  >
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{user?.fullName}</h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle mt-1">
                      {role}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-muted small d-block">Email Address</span>
                  <span className="fw-semibold text-dark">{user?.email}</span>
                </div>

                <div className="mb-3">
                  <span className="text-muted small d-block">Phone Number</span>
                  <span className="fw-semibold text-dark">{user?.phone || 'Not provided'}</span>
                </div>

                <div className="mb-3">
                  <span className="text-muted small d-block">School / Organization</span>
                  <span className="fw-semibold text-dark">{user?.organizationName || 'Independent learner'}</span>
                </div>

                <div className="mb-3">
                  <span className="text-muted small d-block">Account Status</span>
                  <span className="badge bg-success text-white">Active</span>
                </div>

                <div className="mt-4 pt-3 border-top text-muted small">
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Protected with BCrypt encryption & role-based Spring Security.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

