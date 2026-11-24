import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminRequestManagementPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Status update modal
  const [targetReq, setTargetReq] = useState(null);
  const [newStatus, setNewStatus] = useState('APPROVED');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 10,
      };
      if (statusFilter) params.status = statusFilter;
      if (keyword) params.keyword = keyword;

      const res = await adminApi.getRequests(params);
      if (res.success && res.data) {
        setRequests(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load admin requests', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, keyword, currentPage]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleOpenStatusModal = (req) => {
    setTargetReq(req);
    // Pre-populate sensible next step based on state machine
    if (req.status === 'PENDING') {
      setNewStatus('APPROVED');
      setAdminRemarks('Approved by admin for sourcing / fulfillment.');
    } else if (req.status === 'MATCHED') {
      setNewStatus('APPROVED');
      setAdminRemarks('Match confirmed and approved for delivery.');
    } else if (req.status === 'APPROVED') {
      setNewStatus('COMPLETED');
      setAdminRemarks('Materials successfully provided to requester.');
    } else {
      setNewStatus(req.status);
      setAdminRemarks(req.adminRemarks || '');
    }
  };

  const handleUpdateStatus = async () => {
    if (!targetReq) return;
    setUpdating(true);
    try {
      await adminApi.updateRequestStatus(targetReq.id, {
        status: newStatus,
        matchedResourceId: targetReq.matchedResourceId,
        adminRemarks,
      });
      setFeedback({ text: `Request #${targetReq.id} status updated to ${newStatus}.`, type: 'success' });
      setTargetReq(null);
      fetchRequests();
    } catch (err) {
      setFeedback({ text: err.response?.data?.message || 'Could not update request status.', type: 'danger' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-md-9 col-lg-10 p-4">
          <div className="mb-4 pb-2 border-bottom">
            <h3 className="fw-bold text-dark mb-1">
              <i className="bi bi-inbox text-info me-2"></i> Resource Request Management
            </h3>
            <p className="text-muted small mb-0">Review student and school requests, confirm automated matches, and manage fulfillment</p>
          </div>

          {feedback.text && (
            <div className={`alert alert-${feedback.type} py-2 small mb-3 alert-dismissible`}>
              {feedback.text}
              <button type="button" className="btn-close py-2" onClick={() => setFeedback({ text: '', type: '' })}></button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-3 border mb-3 shadow-sm d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search requests by item name or requester..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setCurrentPage(0); }}
              />
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Status:</span>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                style={{ width: '160px' }}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="MATCHED">MATCHED</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading requests registry..." />
          ) : requests.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border shadow-sm">
              <p className="text-muted mb-0">No resource requests found matching criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3 border shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '30%' }}>Requested Item</th>
                      <th>Class & Subject</th>
                      <th>Requester</th>
                      <th>Status</th>
                      <th>Matched Item</th>
                      <th>Date</th>
                      <th className="text-end">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div className="fw-bold text-dark">{r.resourceName}</div>
                          <small className="text-muted text-truncate d-block" style={{ maxWidth: '260px' }}>
                            Qty: {r.quantity} &bull; {r.reason}
                          </small>
                        </td>
                        <td>
                          <div className="small fw-semibold">{r.subjectName}</div>
                          <small className="text-muted">{r.classLevelName}</small>
                        </td>
                        <td>
                          <div className="small fw-semibold">{r.requesterName}</div>
                          <small className="text-muted">{r.requesterOrg || r.requesterEmail}</small>
                        </td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                        <td>
                          {r.matchedResourceId ? (
                            <a
                              href={`/resources/${r.matchedResourceId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-success py-0 px-2 small"
                            >
                              <i className="bi bi-link me-1"></i> {r.matchedResourceTitle ? r.matchedResourceTitle.substring(0, 15) + '...' : 'View Item'}
                            </a>
                          ) : (
                            <span className="text-muted small fst-italic">None</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenStatusModal(r)}
                          >
                            Update Status
                          </button>
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

      {/* Update Status Modal */}
      <ConfirmationModal
        isOpen={!!targetReq}
        title={`Update Request Lifecycle (Req #${targetReq?.id})`}
        message={`Manage state transition for "${targetReq?.resourceName}". Current status: ${targetReq?.status}`}
        confirmText={updating ? 'Updating...' : 'Save Status Update'}
        confirmVariant="primary"
        onConfirm={handleUpdateStatus}
        onCancel={() => setTargetReq(null)}
      >
        <div className="mt-3">
          <label className="form-label small fw-semibold text-dark">Target Lifecycle Status *</label>
          <select
            className="form-select mb-3"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="MATCHED">MATCHED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <label className="form-label small fw-semibold text-dark">Admin Feedback / Remarks</label>
          <textarea
            className="form-control"
            rows="3"
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            placeholder="Feedback provided to the student / school..."
          ></textarea>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default AdminRequestManagementPage;

