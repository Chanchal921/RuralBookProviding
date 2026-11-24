import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { role, canUpload, canRequest, isAdmin } = useAuth();

  return (
    <aside className="dashboard-sidebar p-3">
      <div className="mb-3 px-2">
        <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
          Navigation ({role})
        </span>
      </div>

      <nav className="nav flex-column">
        <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/library" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-book"></i>
          <span>Digital Library</span>
        </NavLink>

        {canUpload && (
          <>
            <NavLink to="/resources/upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Upload Resource</span>
            </NavLink>

            <NavLink to="/my-uploads" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-folder-check"></i>
              <span>My Uploads</span>
            </NavLink>
          </>
        )}

        {canRequest && (
          <>
            <NavLink to="/requests/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-patch-question"></i>
              <span>Request Material</span>
            </NavLink>

            <NavLink to="/my-requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-clock-history"></i>
              <span>My Requests</span>
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <div className="mt-3 mb-2 px-2">
              <span className="text-uppercase text-danger fw-bold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                Admin Operations
              </span>
            </div>

            <NavLink to="/admin/pending" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-hourglass-split text-warning"></i>
              <span>Pending Approvals</span>
            </NavLink>

            <NavLink to="/admin/resources" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-collection text-primary"></i>
              <span>Manage Resources</span>
            </NavLink>

            <NavLink to="/admin/requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-inbox text-info"></i>
              <span>Manage Requests</span>
            </NavLink>

            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people text-secondary"></i>
              <span>Manage Users</span>
            </NavLink>
          </>
        )}

        <div className="mt-3 mb-2 px-2">
          <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
            Account
          </span>
        </div>

        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-person"></i>
          <span>My Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

