import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { resourceApi } from '../api/resourceApi';
import Sidebar from '../components/common/Sidebar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyUploadsPage = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Deletion modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchMyUploads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resourceApi.getMyUploads(currentPage, 10);
      if (res.success && res.data) {
        setUploads(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load user uploads', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchMyUploads();
  }, [fetchMyUploads]);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await resourceApi.deleteResource(deleteTargetId);
      setDeleteTargetId(null);
      fetchMyUploads();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete resource.');
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
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h3 className="fw-bold text-dark mb-1">My Uploaded Resources</h3>
              <p className="text-muted small mb-0">Track verification status, admin feedback, and published materials</p>
            </div>
            <Link to="/resources/upload" className="btn btn-primary-edu btn-sm mt-2 mt-md-0 d-inline-flex align-items-center gap-1">
              <i className="bi bi-cloud-arrow-up"></i> Upload New Resource
            </Link>
          </div>

          {deleteError && (
            <div className="alert alert-danger py-2 small mb-3">{deleteError}</div>
          )}

          {loading ? (
            <LoadingSpinner text="Retrieving your uploads..." />
          ) : uploads.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border shadow-sm my-3">
              <i className="bi bi-folder2-open display-4 text-muted d-block mb-3"></i>
              <h5 className="fw-bold">No Resources Uploaded Yet</h5>
              <p className="text-muted small mb-3">You have not contributed any educational material yet.</p>
              <Link to="/resources/upload" className="btn btn-outline-edu btn-sm">
                Upload Your First Resource
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3 border shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '40%' }}>Title & Subject</th>
                      <th>Class Level</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '320px' }}>
                            {item.title}
                          </div>
                          <small className="text-muted">{item.subjectName}</small>
                          {item.adminRemarks && (
                            <div className="mt-1 small text-info fst-italic">
                              <i className="bi bi-chat-left-text me-1"></i> Admin: {item.adminRemarks}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-light text-muted border">{item.classLevelName}</span>
                        </td>
                        <td>
                          <span className="small text-muted">{item.resourceTypeName}</span>
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
                          <div className="btn-group btn-group-sm">
                            <Link to={`/resources/${item.id}`} className="btn btn-outline-secondary" title="View details">
                              <i className="bi bi-eye"></i>
                            </Link>

                            {item.filePath && (
                              <a
                                href={resourceApi.getDownloadUrl(item.id)}
                                className="btn btn-outline-success"
                                title="Download file"
                              >
                                <i className="bi bi-download"></i>
                              </a>
                            )}

                            {item.status === 'PENDING' && (
                              <button
                                className="btn btn-outline-danger"
                                title="Delete pending upload"
                                onClick={() => setDeleteTargetId(item.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
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

      <ConfirmationModal
        isOpen={!!deleteTargetId}
        title="Delete Pending Resource"
        message="Are you sure you want to delete this pending submission? This action cannot be reversed."
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default MyUploadsPage;

