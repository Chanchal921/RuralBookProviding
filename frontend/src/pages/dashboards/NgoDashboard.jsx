import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NgoDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getNgoDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load NGO dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading NGO community dashboard..." fullPage />;
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
              <h3 className="fw-bold text-dark mb-1">NGO Community Dashboard</h3>
              <p className="text-muted small mb-0">Coordinate village educational outreach, submit learning materials, and monitor requests</p>
            </div>
            <Link to="/resources/upload" className="btn btn-primary-edu btn-sm mt-2 mt-md-0 d-inline-flex align-items-center gap-1">
              <i className="bi bi-cloud-arrow-up"></i> Upload Educational Material
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Uploaded Resources</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.totalUploaded || 0}</h3>
                </div>
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-folder-check"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Approved & Active</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.approvedResources || 0}</h3>
                </div>
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-check-circle"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Pending Review</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.pendingSubmissions || 0}</h3>
                </div>
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-hourglass-split"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div>
                  <span className="text-muted small fw-semibold d-block">Open Community Needs</span>
                  <h3 className="fw-bold text-dark mb-0">{data?.totalOpenRequests || 0}</h3>
                </div>
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads Table */}
          <div className="bg-white p-4 rounded-3 border shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark mb-0">Community Upload History</h5>
              <Link to="/my-uploads" className="small text-success text-decoration-none">View All</Link>
            </div>

            {data?.recentUploads?.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox display-5 d-block mb-2 text-muted"></i>
                <p className="mb-2">No educational materials submitted yet.</p>
                <Link to="/resources/upload" className="btn btn-outline-edu btn-sm">
                  Contribute Learning Asset
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title & Subject</th>
                      <th>Class Level</th>
                      <th>Format</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUploads.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>
                            {item.title}
                          </div>
                          <small className="text-muted">{item.subjectName}</small>
                        </td>
                        <td>
                          <span className="badge bg-light text-muted border">{item.classLevelName}</span>
                        </td>
                        <td>
                          <small className="text-muted">{item.resourceTypeName}</small>
                        </td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td className="text-end">
                          <Link to={`/resources/${item.id}`} className="btn btn-sm btn-outline-secondary">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NgoDashboard;

