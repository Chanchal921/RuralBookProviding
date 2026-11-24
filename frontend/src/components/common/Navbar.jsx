import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, role, logout, canUpload, canRequest } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-ruraledu sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/logo.svg" alt="RuralEdu Logo" width="36" height="36" />
          <span className="brand-text">RuralEdu</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/">
                <i className="bi bi-house me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/library">
                <i className="bi bi-book me-1"></i> Digital Library
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/about">
                <i className="bi bi-info-circle me-1"></i> About RuralEdu
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                {canUpload && (
                  <Link to="/resources/upload" className="btn btn-outline-edu btn-sm d-none d-md-inline-flex align-items-center gap-1">
                    <i className="bi bi-cloud-arrow-up"></i> Upload Resource
                  </Link>
                )}

                {canRequest && (
                  <Link to="/requests/new" className="btn btn-outline-secondary btn-sm d-none d-md-inline-flex align-items-center gap-1">
                    <i className="bi bi-patch-question"></i> Request Material
                  </Link>
                )}

                <div className="dropdown">
                  <button
                    className="btn btn-light dropdown-toggle d-flex align-items-center gap-2 border"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div
                      className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px', fontSize: '13px', fontWeight: 'bold' }}
                    >
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="fw-semibold text-truncate" style={{ maxWidth: '140px' }}>
                      {user.fullName}
                    </span>
                    <span className="badge bg-success-subtle text-success border border-success-subtle ms-1" style={{ fontSize: '10px' }}>
                      {role}
                    </span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                    <li className="px-3 py-1 text-muted" style={{ fontSize: '12px' }}>
                      Signed in as <strong>{user.email}</strong>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        <i className="bi bi-speedometer2 me-2 text-primary"></i> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2 text-secondary"></i> My Profile
                      </Link>
                    </li>

                    {canUpload && (
                      <li>
                        <Link className="dropdown-item" to="/my-uploads">
                          <i className="bi bi-folder me-2 text-success"></i> My Uploaded Resources
                        </Link>
                      </li>
                    )}

                    {canRequest && (
                      <li>
                        <Link className="dropdown-item" to="/my-requests">
                          <i className="bi bi-clock-history me-2 text-warning"></i> My Resource Requests
                        </Link>
                      </li>
                    )}

                    {role === 'ADMIN' && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li className="dropdown-header text-uppercase" style={{ fontSize: '11px' }}>Admin Controls</li>
                        <li>
                          <Link className="dropdown-item" to="/admin/pending">
                            <i className="bi bi-check-circle me-2 text-warning"></i> Pending Approvals
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/resources">
                            <i className="bi bi-collection me-2 text-primary"></i> Manage Resources
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/requests">
                            <i className="bi bi-inbox me-2 text-info"></i> Manage Requests
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/users">
                            <i className="bi bi-people me-2 text-secondary"></i> User Management
                          </Link>
                        </li>
                      </>
                    )}

                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-edu btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-edu btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

