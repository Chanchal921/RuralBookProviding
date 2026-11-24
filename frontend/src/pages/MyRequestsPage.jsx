import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { requestApi } from '../api/requestApi';
import Sidebar from '../components/common/Sidebar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMyRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await requestApi.getMyRequests(currentPage, 10);
      if (res.success && res.data) {
        setRequests(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load user requests', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-md-9 col-lg-10 p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h3 className="fw-bold text-dark mb-1">My Resource Requests</h3>
              <p className="text-muted small mb-0">Track status of your requested learning materials and matching results</p>
            </div>
            <Link to="/requests/new" className="btn btn-primary-edu btn-sm mt-2 mt-md-0 d-inline-flex align-items-center gap-1">
              <i className="bi bi-patch-question"></i> Submit New Request
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading your requests..." />
          ) : requests.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border shadow-sm my-3">
              <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
              <h5 className="fw-bold">No Resource Requests Yet</h5>
              <p className="text-muted small mb-3">Looking for a study guide or book? Submit a request and we'll help source it.</p>
              <Link to="/requests/new" className="btn btn-outline-edu btn-sm">
                Create Resource Request
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3 border shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '35%' }}>Resource Name</th>
                      <th>Class & Subject</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th>Matched Resource</th>
                      <th>Date</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div className="fw-bold text-dark">{req.resourceName}</div>
                          <small className="text-muted text-truncate d-block" style={{ maxWidth: '280px' }}>
                            {req.reason}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border d-block mb-1">{req.classLevelName}</span>
                          <small className="text-muted">{req.subjectName}</small>
                        </td>
                        <td>
                          <span className="small text-muted">{req.quantity}</span>
                        </td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                        <td>
                          {req.matchedResourceId ? (
                            <Link to={`/resources/${req.matchedResourceId}`} className="btn btn-sm btn-outline-success py-0 px-2 small">
                              <i className="bi bi-check2-circle me-1"></i> View Match
                            </Link>
                          ) : (
                            <span className="text-muted small fst-italic">Searching...</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td className="text-end">
                          <Link to={`/requests/${req.id}`} className="btn btn-sm btn-outline-secondary">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-top">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyRequestsPage;

