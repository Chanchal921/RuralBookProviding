import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requestApi } from '../api/requestApi';
import Sidebar from '../components/common/Sidebar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RequestDetailsPage = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await requestApi.getRequestById(id);
        if (res.success && res.data) {
          setRequest(res.data);
        }

        // Fetch potential matches
        const matchesRes = await requestApi.getMatches(id);
        if (matchesRes.success && matchesRes.data) {
          setMatches(matchesRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load request details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading request details..." fullPage />;
  }

  if (error || !request) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning d-inline-block p-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-triangle display-4 text-warning d-block mb-2"></i>
          <h5>Request Not Found</h5>
          <p className="text-muted small mb-3">{error || 'Could not locate the requested resource record.'}</p>
          <Link to="/my-requests" className="btn btn-outline-edu btn-sm">
            &larr; Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-md-9 col-lg-10 p-4">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/my-requests" className="text-decoration-none text-muted">My Requests</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Request #{request.id}</li>
            </ol>
          </nav>

          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h3 className="fw-bold text-dark mb-0">{request.resourceName}</h3>
                <StatusBadge status={request.status} />
              </div>
              <p className="text-muted small mb-0">Requested on {new Date(request.createdAt).toLocaleDateString()}</p>
            </div>
            <Link to="/my-requests" className="btn btn-outline-secondary btn-sm">
              &larr; All Requests
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              {/* Request Info Card */}
              <div className="bg-white p-4 rounded-3 border shadow-sm mb-4">
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Request Details</h5>

                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <span className="text-muted small d-block">Subject</span>
                    <span className="fw-semibold text-dark">{request.subjectName}</span>
                  </div>
                  <div className="col-sm-6">
                    <span className="text-muted small d-block">Class Level</span>
                    <span className="fw-semibold text-dark">{request.classLevelName}</span>
                  </div>
                  <div className="col-sm-6">
                    <span className="text-muted small d-block">Resource Type</span>
                    <span className="fw-semibold text-dark">{request.resourceTypeName}</span>
                  </div>
                  <div className="col-sm-6">
                    <span className="text-muted small d-block">Quantity Requested</span>
                    <span className="fw-semibold text-dark">{request.quantity}</span>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <span className="text-muted small d-block mb-1">Reason / Academic Purpose</span>
                  <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-line' }}>{request.reason}</p>
                </div>

                {request.adminRemarks && (
                  <div className="mt-3 p-3 bg-light rounded-3 border-start border-4 border-info">
                    <span className="fw-bold text-dark small d-block mb-1">
                      <i className="bi bi-chat-quote text-info me-1"></i> Admin Feedback
                    </span>
                    <p className="text-muted small mb-0">{request.adminRemarks}</p>
                  </div>
                )}
              </div>

              {/* Matched Resource Highlight Card */}
              {request.matchedResourceId && (
                <div className="bg-success-subtle p-4 rounded-3 border border-success-subtle shadow-sm mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2 text-success">
                    <i className="bi bi-stars fs-4"></i>
                    <h5 className="fw-bold mb-0">Matched Approved Resource</h5>
                  </div>
                  <p className="text-muted small mb-3">
                    A curriculum material matching your request was verified and linked by our system:
                  </p>
                  <div className="bg-white p-3 rounded border d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{request.matchedResourceTitle}</h6>
                      <small className="text-muted">Available for online reading and download</small>
                    </div>
                    <Link to={`/resources/${request.matchedResourceId}`} className="btn btn-success btn-sm px-3">
                      View Resource <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Matching Suggestions Panel */}
            <div className="col-lg-5">
              <div className="bg-white p-3 rounded-3 border shadow-sm">
                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-lightbulb text-warning"></i> Candidate Resources ({matches.length})
                </h6>

                {matches.length === 0 ? (
                  <p className="text-muted small mb-0">No approved resources currently match this subject and class.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {matches.map((item) => (
                      <div key={item.id} className="p-2 border rounded hover-bg-light">
                        <div className="fw-bold text-truncate" style={{ fontSize: '13px' }}>
                          {item.title}
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-1">
                          <small className="text-muted">{item.subjectName} &bull; {item.classLevelName}</small>
                          <Link to={`/resources/${item.id}`} className="btn btn-outline-success btn-sm py-0 px-2" style={{ fontSize: '11px' }}>
                            Inspect
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

export default RequestDetailsPage;

