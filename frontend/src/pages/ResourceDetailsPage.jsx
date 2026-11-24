import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourceApi } from '../api/resourceApi';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ResourceDetailsPage = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await resourceApi.getResourceById(id);
        if (res.success && res.data) {
          setResource(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve resource details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading resource details..." fullPage />;
  }

  if (error || !resource) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning d-inline-block p-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-triangle display-4 text-warning d-block mb-2"></i>
          <h5>Resource Unavailable</h5>
          <p className="text-muted small mb-3">{error || 'Resource not found or pending verification.'}</p>
          <Link to="/library" className="btn btn-outline-edu btn-sm">
            &larr; Back to Digital Library
          </Link>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/library" className="text-decoration-none text-muted">Digital Library</Link></li>
          <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '300px' }}>
            {resource.title}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          <div className="bg-white p-4 rounded-3 border shadow-sm">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                {resource.subjectName}
              </span>
              <span className="badge bg-light text-muted border px-2 py-1">
                {resource.classLevelName}
              </span>
              <StatusBadge status={resource.status} />
            </div>

            <h2 className="fw-bold text-dark mb-3">{resource.title}</h2>

            <div className="border-top border-bottom py-3 my-3">
              <h6 className="fw-bold text-muted small text-uppercase mb-2">Description & Learning Scope</h6>
              <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                {resource.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* Access Actions */}
            <div className="p-3 bg-light rounded-3 mt-4">
              <h6 className="fw-bold text-dark mb-2">Access Educational Material</h6>
              {resource.filePath ? (
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                  <div>
                    <span className="fw-semibold text-dark d-block text-truncate" style={{ maxWidth: '320px' }}>
                      <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                      {resource.fileName || 'Resource Document'}
                    </span>
                    <small className="text-muted">
                      Size: {formatFileSize(resource.fileSize)} | Format: {resource.fileType || 'Document'}
                    </small>
                  </div>
                  <a
                    href={`/api/resources/${resource.id}/download`}
                    className="btn btn-primary-edu d-inline-flex align-items-center gap-2 px-3"
                  >
                    <i className="bi bi-download"></i> Download Resource
                  </a>
                </div>
              ) : resource.externalUrl ? (
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                  <div>
                    <span className="fw-semibold text-dark d-block">
                      <i className="bi bi-link-45deg text-primary me-2"></i> External Learning Resource
                    </span>
                    <small className="text-muted text-break">{resource.externalUrl}</small>
                  </div>
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary d-inline-flex align-items-center gap-2 px-3"
                  >
                    <i className="bi bi-box-arrow-up-right"></i> Open Resource
                  </a>
                </div>
              ) : (
                <p className="text-muted small mb-0">No digital binary or external link attached to this record.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-lg-4">
          <div className="bg-white p-3 rounded-3 border shadow-sm mb-3">
            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Metadata Information</h6>

            <div className="mb-2">
              <span className="text-muted small d-block">Resource Type</span>
              <span className="fw-semibold text-dark">{resource.resourceTypeName || 'N/A'}</span>
            </div>

            <div className="mb-2">
              <span className="text-muted small d-block">Target Academic Level</span>
              <span className="fw-semibold text-dark">{resource.classLevelName || 'N/A'}</span>
            </div>

            <div className="mb-2">
              <span className="text-muted small d-block">Subject</span>
              <span className="fw-semibold text-dark">{resource.subjectName || 'N/A'}</span>
            </div>

            <div className="mb-2">
              <span className="text-muted small d-block">Contributed By</span>
              <span className="fw-semibold text-dark">{resource.uploadedByName || 'Contributor'}</span>
              {resource.uploadedByOrg && (
                <small className="text-muted d-block">{resource.uploadedByOrg}</small>
              )}
            </div>

            <div className="mb-0">
              <span className="text-muted small d-block">Published Date</span>
              <span className="text-dark small">
                {new Date(resource.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {resource.adminRemarks && (
            <div className="bg-white p-3 rounded-3 border shadow-sm">
              <h6 className="fw-bold text-success border-bottom pb-2 mb-2 d-flex align-items-center gap-1">
                <i className="bi bi-patch-check"></i> Verification Note
              </h6>
              <p className="text-muted small mb-0 fst-italic">"{resource.adminRemarks}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsPage;

