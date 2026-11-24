import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getTeacherDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load teacher dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading educator & school dashboard..." fullPage />;
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
              <h3 className="fw-bold text-dark mb-1">Teacher & School Dashboard</h3>
              <p className="text-muted small mb-0">Manage classroom curriculum materials, school requests, and teaching resources</p>
            </div>
            <div className="d-flex gap-2 mt-2 mt-md-0">
              <Link to="/resources/upload" className="btn btn-outline-edu btn-sm">
                <i className="bi bi-cloud-arrow-up me-1"></i> Upload Material
              </Link>
              <Link to="/requests/new" className="btn btn-primary-edu btn-sm">
                <i className="bi bi-patch-question me-1"></i> Request Classroom Kit
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Available Resources</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.availableResources || 0}</h3>
                </div>
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-book"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">My Uploads</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.myUploadedResources || 0}</h3>
                </div>
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-folder-check"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">My Requests</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.myRequests || 0}</h3>
                </div>
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-inbox"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Matched Materials</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.matchedRequests || 0}</h3>
                </div>
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="bi bi-stars"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Recent Classroom Resources */}
            <div className="col-lg-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h6 className="fw-bold text-dark mb-0">Library Resources for Teaching</h6>
                  <Link to="/library" className="small text-success text-decoration-none">Search Library</Link>
                </div>

                {data?.recentResources?.length === 0 ? (
                  <p className="text-muted small mb-0 py-3 text-center">No library resources available.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {data.recentResources.map((item) => (
                      <div key={item.id} className="p-2 border rounded d-flex align-items-center justify-content-between">
                        <div className="text-truncate me-2">
                          <span className="fw-semibold text-dark text-truncate d-block" style={{ fontSize: '13px' }}>
                            {item.title}
                          </span>
                          <small className="text-muted">{item.subjectName} &bull; {item.classLevelName}</small>
                        </div>
                        <Link to={`/resources/${item.id}`} className="btn btn-outline-success btn-sm py-0 px-2" style={{ fontSize: '12px' }}>
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* School Requests */}
            <div className="col-lg-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h6 className="fw-bold text-dark mb-0">School Resource Requests</h6>
                  <Link to="/my-requests" className="small text-success text-decoration-none">View All</Link>
                </div>

                {data?.myRecentRequests?.length === 0 ? (
                  <div className="text-center py-4 text-muted small">
                    <p className="mb-2">No active classroom material requests.</p>
                    <Link to="/requests/new" className="btn btn-outline-edu btn-sm">
                      Submit Request
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {data.myRecentRequests.map((req) => (
                      <div key={req.id} className="p-2 border rounded d-flex align-items-center justify-content-between">
                        <div className="text-truncate me-2">
                          <span className="fw-semibold text-dark text-truncate d-block" style={{ fontSize: '13px' }}>
                            {req.resourceName} (Qty: {req.quantity})
                          </span>
                          <small className="text-muted">{req.subjectName} &bull; {req.classLevelName}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <StatusBadge status={req.status} />
                          <Link to={`/requests/${req.id}`} className="btn btn-light btn-sm py-0 px-2 border" style={{ fontSize: '12px' }}>
                            Details
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

export default TeacherDashboard;

