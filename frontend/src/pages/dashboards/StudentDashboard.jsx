import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStudentDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load student dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading student learning dashboard..." fullPage />;
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
              <h3 className="fw-bold text-dark mb-1">Student Learning Dashboard</h3>
              <p className="text-muted small mb-0">Browse approved textbooks, exam notes, and track your requested study resources</p>
            </div>
            <div className="d-flex gap-2 mt-2 mt-md-0">
              <Link to="/library" className="btn btn-outline-edu btn-sm">
                <i className="bi bi-book me-1"></i> Digital Library
              </Link>
              <Link to="/requests/new" className="btn btn-primary-edu btn-sm">
                <i className="bi bi-patch-question me-1"></i> Request Resource
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Available Resources</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.totalAvailableResources || 0}</h3>
                </div>
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-book"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">My Total Requests</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.myTotalRequests || 0}</h3>
                </div>
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-inbox"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Pending Requests</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.myPendingRequests || 0}</h3>
                </div>
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-hourglass-split"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Matched Resources</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.myMatchedRequests || 0}</h3>
                </div>
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="bi bi-stars"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Added Resources & My Requests */}
          <div className="row g-4">
            {/* Recently Added */}
            <div className="col-lg-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h6 className="fw-bold text-dark mb-0">Recently Added to Library</h6>
                  <Link to="/library" className="small text-success text-decoration-none">View All</Link>
                </div>

                {data?.recentlyAddedResources?.length === 0 ? (
                  <p className="text-muted small mb-0 py-3 text-center">No recent resources published yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {data.recentlyAddedResources.map((item) => (
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

            {/* My Requests */}
            <div className="col-lg-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h6 className="fw-bold text-dark mb-0">My Recent Requests</h6>
                  <Link to="/my-requests" className="small text-success text-decoration-none">View All</Link>
                </div>

                {data?.myRecentRequests?.length === 0 ? (
                  <div className="text-center py-4 text-muted small">
                    <p className="mb-2">You haven't requested any resources yet.</p>
                    <Link to="/requests/new" className="btn btn-outline-edu btn-sm">
                      Submit a Request
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {data.myRecentRequests.map((req) => (
                      <div key={req.id} className="p-2 border rounded d-flex align-items-center justify-content-between">
                        <div className="text-truncate me-2">
                          <span className="fw-semibold text-dark text-truncate d-block" style={{ fontSize: '13px' }}>
                            {req.resourceName}
                          </span>
                          <small className="text-muted">{req.subjectName} &bull; {req.classLevelName}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <StatusBadge status={req.status} />
                          <Link to={`/requests/${req.id}`} className="btn btn-light btn-sm py-0 px-2 border" style={{ fontSize: '12px' }}>
                            View
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

export default StudentDashboard;

