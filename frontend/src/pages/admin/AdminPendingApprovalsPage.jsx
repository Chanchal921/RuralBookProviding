import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminPendingApprovalsPage = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Approval / Rejection Action Modal States
  const [actionItem, setActionItem] = useState(null); // item being reviewed
  const [actionType, setActionType] = useState('APPROVE'); // 'APPROVE' or 'REJECT'
  const [adminRemarks, setAdminRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getResources({
        status: 'PENDING',
        page: currentPage,
        size: 10,
      });
      if (res.success && res.data) {
        setPendingList(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load pending resources', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleOpenModal = (item, type) => {
    setActionItem(item);
    setActionType(type);
    setAdminRemarks(type === 'APPROVE' ? 'Curriculum aligned and verified for publication.' : 'Submission does not meet syllabus guidelines.');
  };

  const handleConfirmAction = async () => {
    if (!actionItem) return;
    setProcessing(true);
    setFeedbackMsg({ text: '', type: '' });
    try {
      if (actionType === 'APPROVE') {
        await adminApi.approveResource(actionItem.id, adminRemarks);
        setFeedbackMsg({ text: `Resource "${actionItem.title}" approved and published to the Digital Library.`, type: 'success' });
      } else {
        await adminApi.rejectResource(actionItem.id, adminRemarks);
        setFeedbackMsg({ text: `Resource "${actionItem.title}" was rejected.`, type: 'warning' });
      }
      setActionItem(null);
      fetchPending();
    } catch (err) {
      setFeedbackMsg({ text: err.response?.data?.message || 'Failed to update resource verification status.', type: 'danger' });
    } finally {
      setProcessing(false);
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
              <i className="bi bi-hourglass-split text-warning me-2"></i> Pending Resource Approvals
            </h3>
            <p className="text-muted small mb-0">
              Review and verify newly submitted educational textbooks, notes, and links before public release
            </p>
          </div>

          {feedbackMsg.text && (
            <div className={`alert alert-${feedbackMsg.type} py-2 small mb-3 alert-dismissible`}>
              {feedbackMsg.text}
              <button type="button" className="btn-close py-2" onClick={() => setFeedbackMsg({ text: '', type: '' })}></button>
            </div>
          )}

          {loading ? (
            <LoadingSpinner text="Scanning pending submissions..." />
          ) : pendingList.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border shadow-sm my-3">
              <i className="bi bi-check-circle display-4 text-success d-block mb-2"></i>
              <h5 className="fw-bold">No Pending Submissions</h5>
              <p className="text-muted small mb-0">All submitted educational materials have been reviewed and verified!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3 border shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '35%' }}>Title & Description</th>
                      <th>Subject & Class</th>
                      <th>Uploaded By</th>
                      <th>Type & Asset</th>
                      <th>Date</th>
                      <th className="text-end">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingList.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-bold text-dark">{item.title}</div>
                          <small className="text-muted text-truncate d-block" style={{ maxWidth: '280px' }}>
                            {item.description || 'No description provided'}
                          </small>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark small">{item.subjectName}</div>
                          <small className="text-muted">{item.classLevelName}</small>
                        </td>
                        <td>
                          <div className="small fw-semibold">{item.uploadedByName}</div>
                          <small className="text-muted">{item.uploadedByOrg || 'Independent'}</small>
                        </td>
                        <td>
                          {item.filePath ? (
                            <a
                              href={`/api/resources/${item.id}/download`}
                              className="btn btn-sm btn-outline-danger py-0 px-2 small d-inline-flex align-items-center gap-1"
                              title="Download to inspect file"
                            >
                              <i className="bi bi-file-earmark-pdf"></i> PDF File
                            </a>
                          ) : item.externalUrl ? (
                            <a
                              href={item.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary py-0 px-2 small d-inline-flex align-items-center gap-1"
                              title="Open link in new tab"
                            >
                              <i className="bi bi-link-45deg"></i> Open Link
                            </a>
                          ) : (
                            <span className="text-muted small">N/A</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-success"
                              onClick={() => handleOpenModal(item, 'APPROVE')}
                              title="Approve resource into library"
                            >
                              <i className="bi bi-check-lg me-1"></i> Approve
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleOpenModal(item, 'REJECT')}
                              title="Reject submission"
                            >
                              <i className="bi bi-x-lg me-1"></i> Reject
                            </button>
                          </div>
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

      {/* Review Modal */}
      <ConfirmationModal
        isOpen={!!actionItem}
        title={actionType === 'APPROVE' ? 'Approve Educational Resource' : 'Reject Resource Submission'}
        message={`Confirm action for "${actionItem?.title}".`}
        confirmText={processing ? 'Processing...' : actionType === 'APPROVE' ? 'Approve & Publish' : 'Confirm Rejection'}
        confirmVariant={actionType === 'APPROVE' ? 'success' : 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={() => setActionItem(null)}
      >
        <div className="mt-3">
          <label className="form-label small fw-semibold text-dark">
            Admin Verification Remarks / Feedback *
          </label>
          <textarea
            className="form-control"
            rows="3"
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            placeholder="Enter reason or verification notes..."
            required
          ></textarea>
          <small className="text-muted d-block mt-1">
            These remarks will be attached to the resource metadata and visible to the contributor.
          </small>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default AdminPendingApprovalsPage;

