import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import { resourceApi } from '../../api/resourceApi';
import Sidebar from '../../components/common/Sidebar';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminResourceManagementPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Deactivate modal
  const [deactivateItem, setDeactivateItem] = useState(null);
  const [deactivateRemarks, setDeactivateRemarks] = useState('');
  const [deactivating, setDeactivating] = useState(false);

  // Delete modal
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 10,
      };
      if (statusFilter) params.status = statusFilter;
      if (keyword) params.keyword = keyword;

      const res = await adminApi.getResources(params);
      if (res.success && res.data) {
        setResources(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load resources', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, keyword, currentPage]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDeactivate = async () => {
    if (!deactivateItem) return;
    setDeactivating(true);
    try {
      await adminApi.deactivateResource(deactivateItem.id, deactivateRemarks || 'Deactivated due to outdated syllabus.');
      setFeedback({ text: `Resource "${deactivateItem.title}" has been deactivated.`, type: 'info' });
      setDeactivateItem(null);
      fetchResources();
    } catch (err) {
      setFeedback({ text: err.response?.data?.message || 'Could not deactivate resource.', type: 'danger' });
    } finally {
      setDeactivating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await resourceApi.deleteResource(deleteItem.id);
      setFeedback({ text: `Resource "${deleteItem.title}" has been permanently deleted.`, type: 'success' });
      setDeleteItem(null);
      fetchResources();
    } catch (err) {
      setFeedback({ text: err.response?.data?.message || 'Could not delete resource.', type: 'danger' });
    } finally {
      setDeleting(false);
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
              <i className="bi bi-collection text-primary me-2"></i> All Educational Resources
            </h3>
            <p className="text-muted small mb-0">Manage published, pending, and archived materials across the RuralEdu platform</p>
          </div>

          {feedback.text && (
            <div className={`alert alert-${feedback.type} py-2 small mb-3 alert-dismissible`}>
              {feedback.text}
              <button type="button" className="btn-close py-2" onClick={() => setFeedback({ text: '', type: '' })}></button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-3 border mb-3 shadow-sm d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '450px' }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search title or keywords..."
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
                <option value="APPROVED">APPROVED</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
                <option value="DEACTIVATED">DEACTIVATED</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading resources database..." />
          ) : resources.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border shadow-sm">
              <p className="text-muted mb-0">No resources found matching criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3 border shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '35%' }}>Title</th>
                      <th>Subject & Class</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Contributor</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>
                            {r.title}
                          </div>
                          <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                        </td>
                        <td>
                          <div className="small fw-semibold">{r.subjectName}</div>
                          <small className="text-muted">{r.classLevelName}</small>
                        </td>
                        <td>
                          <small className="text-muted">{r.resourceTypeName}</small>
                        </td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                        <td>
                          <div className="small fw-semibold">{r.uploadedByName}</div>
                          <small className="text-muted">{r.uploadedByOrg || 'User'}</small>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <a href={`/resources/${r.id}`} className="btn btn-outline-secondary" title="View details">
                              <i className="bi bi-eye"></i>
                            </a>

                            {r.status === 'APPROVED' && (
                              <button
                                className="btn btn-outline-warning text-dark"
                                title="Deactivate outdated resource"
                                onClick={() => {
                                  setDeactivateItem(r);
                                  setDeactivateRemarks('Content is outdated or replaced by a newer edition.');
                                }}
                              >
                                <i className="bi bi-slash-circle"></i>
                              </button>
                            )}

                            <button
                              className="btn btn-outline-danger"
                              title="Delete permanently"
                              onClick={() => setDeleteItem(r)}
                            >
                              <i className="bi bi-trash"></i>
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

      {/* Deactivate Modal */}
      <ConfirmationModal
        isOpen={!!deactivateItem}
        title="Deactivate Approved Resource"
        message={`Are you sure you want to deactivate "${deactivateItem?.title}"? It will no longer appear in the public Digital Library.`}
        confirmText={deactivating ? 'Deactivating...' : 'Deactivate'}
        confirmVariant="warning"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateItem(null)}
      >
        <div className="mt-3">
          <label className="form-label small fw-semibold text-dark">Deactivation Reason *</label>
          <input
            type="text"
            className="form-control"
            value={deactivateRemarks}
            onChange={(e) => setDeactivateRemarks(e.target.value)}
            placeholder="e.g. Superseded by newer syllabus guidelines"
          />
        </div>
      </ConfirmationModal>

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={!!deleteItem}
        title="Permanently Delete Resource"
        message={`Are you sure you want to delete "${deleteItem?.title}" and remove its file storage?`}
        confirmText={deleting ? 'Deleting...' : 'Delete Permanently'}
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
};

export default AdminResourceManagementPage;

