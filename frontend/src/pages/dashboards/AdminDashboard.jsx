import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await dashboardApi.getAdminDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading Central Admin Dashboard..." fullPage />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-md-9 col-lg-10 p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h3 className="fw-bold text-dark mb-1">RuralEdu Central Administration</h3>
              <p className="text-muted small mb-0">System-wide verification metrics, platform statistics, and moderation workflows</p>
            </div>
            <div className="d-flex gap-2 mt-2 mt-md-0">
              <Link to="/admin/pending" className="btn btn-warning text-dark btn-sm fw-bold">
                <i className="bi bi-hourglass-split me-1"></i> Review Pending ({data?.pendingResources || 0})
              </Link>
            </div>
          </div>

          {/* Overarching Metrics Row */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card border-start border-4 border-primary">
                <div>
                  <span className="text-muted small fw-semibold d-block">Total Registered Users</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.totalUsers || 0}</h3>
                  <small className="text-muted" style={{ fontSize: '11px' }}>
                    {data?.studentsCount || 0} Students &bull; {data?.teachersCount || 0} Teachers
                  </small>
                </div>
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card border-start border-4 border-warning">
                <div>
                  <span className="text-muted small fw-semibold d-block">Pending Verifications</span>
                  <h3 className="fw-bold text-warning mb-0">{data?.pendingResources || 0}</h3>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Awaiting admin approval</small>
                </div>
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-shield-exclamation"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card border-start border-4 border-success">
                <div>
                  <span className="text-muted small fw-semibold d-block">Approved Live Assets</span>
                  <h3 className="fw-bold text-success mb-0">{data?.approvedResources || 0}</h3>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Published in library</small>
                </div>
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-check-circle"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card border-start border-4 border-info">
                <div>
                  <span className="text-muted small fw-semibold d-block">Resource Requests</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.totalRequests || 0}</h3>
                  <small className="text-muted" style={{ fontSize: '11px' }}>
                    {data?.pendingRequests || 0} Pending &bull; {data?.matchedRequests || 0} Matched
                  </small>
                </div>
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="bi bi-inbox"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions Row */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <Link to="/admin/pending" className="btn btn-outline-warning text-dark w-100 p-3 text-start bg-white shadow-sm border">
                <i className="bi bi-hourglass-split fs-4 text-warning d-block mb-1"></i>
                <span className="fw-bold d-block">Pending Approvals</span>
                <small className="text-muted">Review and verify new uploads</small>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to="/admin/resources" className="btn btn-outline-primary w-100 p-3 text-start bg-white shadow-sm border">
                <i className="bi bi-collection fs-4 text-primary d-block mb-1"></i>
                <span className="fw-bold d-block">Manage Resources</span>
                <small className="text-muted">Deactivate or edit materials</small>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to="/admin/requests" className="btn btn-outline-info text-dark w-100 p-3 text-start bg-white shadow-sm border">
                <i className="bi bi-inbox fs-4 text-info d-block mb-1"></i>
                <span className="fw-bold d-block">Resource Requests</span>
                <small className="text-muted">Match and complete requests</small>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to="/admin/users" className="btn btn-outline-secondary w-100 p-3 text-start bg-white shadow-sm border">
                <i className="bi bi-people fs-4 text-secondary d-block mb-1"></i>
                <span className="fw-bold d-block">User Management</span>
                <small className="text-muted">Manage roles and permissions</small>
              </Link>
            </div>
          </div>

          {/* Recent Feeds Row */}
          <div className="row g-4">
            {/* Recent Submissions */}
            <div className="col-lg-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h6 className="fw-bold text-dark mb-0">Recent Library Publications</h6>
                  <Link to="/admin/resources" className="small text-success text-decoration-none">View All</Link>
                </div>

                {data?.recentResources?.length === 0 ? (
                  <p className="text-muted small py-3 text-center mb-0">No resources available.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {data.recentResources.map((item) => (
                      <div key={item.id} className="p-2 border rounded d-flex align-items-center justify-content-between">
                        <div className="text-truncate me-2">
                          <span className="fw-semibold text-dark text-truncate d-block" style={{ fontSize: '13px' }}>
                            {item.title}
                          </span>
                          <small className="text-muted">{item.subjectName} &bull; Uploaded by {item.uploadedByName}</small>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Requests */}
            <div className="col-lg-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h6 className="fw-bold text-dark mb-0">Recent Student & School Requests</h6>
                  <Link to="/admin/requests" className="small text-success text-decoration-none">View All</Link>
                </div>

                {data?.recentRequests?.length === 0 ? (
                  <p className="text-muted small py-3 text-center mb-0">No recent requests recorded.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {data.recentRequests.map((req) => (
                      <div key={req.id} className="p-2 border rounded d-flex align-items-center justify-content-between">
                        <div className="text-truncate me-2">
                          <span className="fw-semibold text-dark text-truncate d-block" style={{ fontSize: '13px' }}>
                            {req.resourceName}
                          </span>
                          <small className="text-muted">{req.requesterName} &bull; {req.classLevelName}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <StatusBadge status={req.status} />
                          <Link to={`/admin/requests`} className="btn btn-light btn-sm py-0 px-2 border" style={{ fontSize: '12px' }}>
                            Manage
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

